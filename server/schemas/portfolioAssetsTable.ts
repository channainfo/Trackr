import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { portfoliosTable } from "./portfoliosTable";  // Importing portfolios table
import { cryptoAssetsTable } from "./cryptoAssetsTable";  // Importing cryptoAssets table
import { z } from "zod";

// Portfolio Assets table - represents holdings in a portfolio
export const portfolioAssetsTable = pgTable("portfolio_assets", {
  id: serial("id").primaryKey(),
  portfolioId: integer("portfolio_id").notNull().references(() => portfoliosTable.id),
  assetId: integer("asset_id").notNull().references(() => cryptoAssetsTable.id),
  amount: text("amount").notNull(), // Stored as string for precision
  purchasePrice: text("purchase_price"), // Average purchase price (optional)
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertPortfolioAssetSchema = createInsertSchema(portfolioAssetsTable).omit({
  id: true,
  createdAt: true,
});

// Type exports
export type PortfolioAsset = typeof portfolioAssetsTable.$inferSelect;
export type InsertPortfolioAsset = z.infer<typeof insertPortfolioAssetSchema>;
