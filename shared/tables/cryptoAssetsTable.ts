import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Crypto Assets table
export const cryptoAssetsTable = pgTable("crypto_assets", {
  id: serial("id").primaryKey(),
  symbol: text("symbol").notNull().unique(),
  name: text("name").notNull(),
  icon: text("icon"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertAssetSchema = createInsertSchema(cryptoAssetsTable).omit({
  id: true,
  createdAt: true,
});

// Type exports
export type CryptoAsset = typeof cryptoAssetsTable.$inferSelect;
export type InsertCryptoAsset = z.infer<typeof insertAssetSchema>;
