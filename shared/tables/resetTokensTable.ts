import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

// Reset tokens table for password reset functionality
export const resetTokensTable = pgTable('reset_tokens', {
  token: text('token').primaryKey(),
  email: text('email').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const insertResetTokenSchema = createInsertSchema(resetTokensTable);

// Type exports
export type ResetToken = typeof resetTokensTable.$inferSelect;
export type InsertResetToken = z.infer<typeof insertResetTokenSchema>;
