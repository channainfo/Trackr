import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express, Request, Response, NextFunction } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser, User } from "@shared/schema";
import { db } from "./db";
import { activityLogsTable } from "@shared/schema";

declare global {
  namespace Express {
    interface User extends SelectUser { }
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

function logActivity(userId: number | null, action: string, details: any = {}, req: Request) {
  try {
    db.insert(activityLogsTable).values({
      userId,
      action,
      details,
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    }).execute();
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
}

export function setupAuth(app: Express) {
  const sessionSecret = process.env.SESSION_SECRET || randomBytes(32).toString("hex");

  const sessionSettings: session.SessionOptions = {
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  // Rate limiting for login attempts
  const loginAttempts = new Map<string, { count: number, lastAttempt: number }>();
  const maxLoginAttempts = 5;
  const loginLockoutTime = 15 * 60 * 1000; // 15 minutes

  passport.use(
    new LocalStrategy({
      usernameField: 'username',
      passwordField: 'password'
    }, async (username, password, done) => {
      try {
        const ip = "127.0.0.1"; // In a real app, this would be req.ip
        const userAttempts = loginAttempts.get(ip) || { count: 0, lastAttempt: 0 };

        // Check if user is locked out
        if (userAttempts.count >= maxLoginAttempts) {
          const timeElapsed = Date.now() - userAttempts.lastAttempt;
          if (timeElapsed < loginLockoutTime) {
            return done(null, false, { message: `Too many failed login attempts. Try again after ${Math.ceil((loginLockoutTime - timeElapsed) / 60000)} minutes.` });
          }
          // Reset on lockout expiry
          loginAttempts.set(ip, { count: 0, lastAttempt: Date.now() });
        }

        const user = await storage.userStorage.getUserByUsername(username);
        if (!user || !(await comparePasswords(password, user.password))) {
          // Track failed attempts
          loginAttempts.set(ip, {
            count: userAttempts.count + 1,
            lastAttempt: Date.now()
          });
          return done(null, false, { message: 'Invalid username or password' });
        }

        // Successful login, reset attempts
        loginAttempts.set(ip, { count: 0, lastAttempt: Date.now() });
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.userStorage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  app.post("/api/register", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, email, password } = req.body;

      console.log("=============body: ", req.body);

      // Check if user already exists
      const existingUser = await storage.userStorage.getUserByUsername(username);

      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const existingEmail = await storage.userStorage.getUserByEmail(email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }

      // Create user
      const hashedPassword = await hashPassword(password);
      const user = await storage.userStorage.createUser({
        username,
        email,
        password: hashedPassword,
        isAdmin: false,
        themePreference: 'dark',
        confirmPassword: '' // Not stored in DB
      });

      // Create default portfolio for the user
      await storage.portfolioStorage.createPortfolio({
        userId: user.id,
        name: "My Portfolio"
      });

      logActivity(user.id, "user_registered", { username }, req);

      // Log the user in
      req.login(user, (err) => {
        if (err) return next(err);
        return res.status(201).json({
          id: user.id,
          uuid: user.uuid,
          username: user.username,
          email: user.email,
          isAdmin: user.isAdmin,
          themePreference: user.themePreference,
          createdAt: user.createdAt
        });
      });
    } catch (error: any) {
      console.log('Registration error:', error.message);
      console.log('Stack trace:', error.stack);
      return res.status(500).json({ message: "Registration failed" });
    }
  });

  app.post("/api/login", (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", (err: any, user: User, info: any) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ message: info?.message || "Invalid username or password" });
      }

      req.login(user, (loginErr) => {
        if (loginErr) return next(loginErr);

        logActivity(user.id, "user_login", {}, req);

        return res.status(200).json({
          id: user.id,
          uuid: user.uuid,
          username: user.username,
          email: user.email,
          isAdmin: user.isAdmin,
          themePreference: user.themePreference,
          createdAt: user.createdAt
        });
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    req.logout((err) => {
      if (err) return next(err);

      if (userId) {
        logActivity(userId, "user_logout", {}, req);
      }

      res.status(200).json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/user", (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = req.user;
    return res.status(200).json({
      id: user.id,
      uuid: user.uuid,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      themePreference: user.themePreference,
      createdAt: user.createdAt
    });
  });

  app.put("/api/user/theme", (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const { themePreference } = req.body;
    if (!themePreference || (themePreference !== 'dark' && themePreference !== 'light')) {
      return res.status(400).json({ message: "Invalid theme preference" });
    }

    storage.userStorage.updateUserTheme(req.user.id, themePreference)
      .then((updatedUser) => {
        logActivity(req.user?.id, "theme_changed", { themePreference }, req);
        return res.status(200).json({
          id: updatedUser.id,
          uuid: updatedUser.uuid,
          username: updatedUser.username,
          email: updatedUser.email,
          isAdmin: updatedUser.isAdmin,
          themePreference: updatedUser.themePreference,
          createdAt: updatedUser.createdAt
        });
      })
      .catch((error) => {
        console.error('Theme update error:', error);
        return res.status(500).json({ message: "Failed to update theme preference" });
      });
  });
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Authentication required" });
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated() && req.user.isAdmin) {
    return next();
  }
  res.status(403).json({ message: "Admin access required" });
}
