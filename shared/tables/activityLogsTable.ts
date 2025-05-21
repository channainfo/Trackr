import { pgTable, text, serial, integer, jsonb, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { usersTable } from './usersTable';  // Importing users table
import { z } from 'zod';

// ActivityLog table for admin tracking
export const activityLogsTable = pgTable('activity_logs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => usersTable.id),
  action: text('action').notNull(),
  details: jsonb('details'),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  timestamp: timestamp('timestamp').notNull().defaultNow(),
});

export const insertActivityLogSchema = createInsertSchema(activityLogsTable).omit({
  id: true,
  timestamp: true,
});

// Type exports
export type ActivityLog = typeof activityLogsTable.$inferSelect;
export type InsertActivityLog = z.infer<typeof insertActivityLogSchema>;
