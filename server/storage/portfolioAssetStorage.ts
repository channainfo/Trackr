import { db } from "../db";
import { portfolioAssetsTable, cryptoAssetsTable } from "@shared/schema";
import { InsertPortfolioAsset, PortfolioAsset, CryptoAsset } from "@shared/schema";
import { eq } from "drizzle-orm";

export class PortfolioAssetStorage {
  async getPortfolioAssets(portfolioId: number): Promise<(PortfolioAsset & { asset: CryptoAsset })[]> {
    const result = await db
      .select()
      .from(portfolioAssetsTable)
      .innerJoin(cryptoAssetsTable, eq(portfolioAssetsTable.assetId, cryptoAssetsTable.id))
      .where(eq(portfolioAssetsTable.portfolioId, portfolioId));

    return result.map(row => ({
      ...row.portfolio_assets,
      asset: row.crypto_assets
    }));
  }

  async addPortfolioAsset(asset: InsertPortfolioAsset): Promise<PortfolioAsset> {
    const [newAsset] = await db
      .insert(portfolioAssetsTable)
      .values(asset)
      .returning();
    return newAsset;
  }

  async updatePortfolioAsset(id: number, amount: string): Promise<PortfolioAsset> {
    const [updatedAsset] = await db
      .update(portfolioAssetsTable)
      .set({ amount })
      .where(eq(portfolioAssetsTable.id, id))
      .returning();
    return updatedAsset;
  }
}
