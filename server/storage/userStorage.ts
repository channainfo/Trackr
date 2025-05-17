import { db } from "../db";
import { usersTable } from "@shared/schema";
import { InsertUser, User } from "@shared/schema";
import { eq } from "drizzle-orm";


export class UserStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));
    return user || undefined;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(usersTable).values(user).returning();
    return newUser;
  }

  async updateUserTheme(id: number, theme: string): Promise<User> {
    const [updatedUser] = await db
      .update(usersTable)
      .set({ themePreference: theme })
      .where(eq(usersTable.id, id))
      .returning();
    return updatedUser;
  }

  async updateUserAdmin(id: number, isAdmin: boolean): Promise<User> {
    const [updatedUser] = await db
      .update(usersTable)
      .set({ isAdmin })
      .where(eq(usersTable.id, id))
      .returning();
    return updatedUser;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(usersTable);
  }
}
