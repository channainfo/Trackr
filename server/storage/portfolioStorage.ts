import { db } from '../db';
import { portfoliosTable } from '@shared/schema';
import { InsertPortfolio, Portfolio } from '@shared/schema';
import { eq } from 'drizzle-orm';

export class PortfolioStorage {
  async getUserPortfolios(userId: number): Promise<Portfolio[]> {
    return await db
      .select()
      .from(portfoliosTable)
      .where(eq(portfoliosTable.userId, userId));
  }

  async getPortfolio(id: number): Promise<Portfolio | undefined> {
    const [portfolio] = await db
      .select()
      .from(portfoliosTable)
      .where(eq(portfoliosTable.id, id));
    return portfolio || undefined;
  }

  async createPortfolio(portfolio: InsertPortfolio): Promise<Portfolio> {
    const [newPortfolio] = await db
      .insert(portfoliosTable)
      .values(portfolio)
      .returning();
    return newPortfolio;
  }
}
