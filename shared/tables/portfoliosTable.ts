import { pgTable, text, serial, integer, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { usersTable } from './usersTable';  // Importing users table
import { z } from 'zod';

// Portfolios table
export const portfoliosTable = pgTable('portfolios', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => usersTable.id),
  name: text('name').notNull().default('My Portfolio'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const insertPortfolioSchema = createInsertSchema(portfoliosTable).omit({
  id: true,
  createdAt: true,
});

// Type exports
export type Portfolio = typeof portfoliosTable.$inferSelect;
export type InsertPortfolio = z.infer<typeof insertPortfolioSchema>;
