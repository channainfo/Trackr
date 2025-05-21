import { pgTable, text, serial, integer, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { usersTable } from './usersTable';  // Importing users table
import { cryptoAssetsTable } from './cryptoAssetsTable';  // Importing cryptoAssets table
import { z } from 'zod';

// Transactions table
export const transactionsTable = pgTable('transactions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => usersTable.id),
  assetId: integer('asset_id').notNull().references(() => cryptoAssetsTable.id),
  type: text('type').notNull(), // buy, sell, transfer
  amount: text('amount').notNull(), // Stored as string for precision
  price: text('price').notNull(), // Price at transaction time
  timestamp: timestamp('timestamp').notNull().defaultNow(),
  note: text('note'),
});

export const insertTransactionSchema = createInsertSchema(transactionsTable).omit({
  id: true,
  timestamp: true,
});

// Type exports
export type Transaction = typeof transactionsTable.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
