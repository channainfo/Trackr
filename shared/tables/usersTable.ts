import { pgTable, text, serial, uuid, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  uuid: uuid("uuid").notNull().defaultRandom(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  themePreference: text("theme_preference").notNull().default("dark"),
});

export const insertUserSchema = createInsertSchema(usersTable)
  .omit({ id: true, uuid: true, createdAt: true })
  .extend({
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Update schema
export const updateUserSchema = createUpdateSchema(usersTable)
  .omit({ id: true, uuid: true, createdAt: true })
  .extend({
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
  .refine((data) => {
    // Ensure password and confirmPassword match if both are provided
    if (data.password && data.confirmPassword && data.password !== data.confirmPassword) {
      return false;
    }
    return true;
  }, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Type exports
export type User = typeof usersTable.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
