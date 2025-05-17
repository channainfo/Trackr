import { db } from "../db";
import { transactionsTable, cryptoAssetsTable } from "@shared/schema";
import { InsertTransaction, Transaction, CryptoAsset } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export class TransactionStorage {
  async getUserTransactions(userId: number): Promise<(Transaction & { asset: CryptoAsset })[]> {
    const result = await db
      .select()
      .from(transactionsTable)
      .innerJoin(cryptoAssetsTable, eq(transactionsTable.assetId, cryptoAssetsTable.id))
      .where(eq(transactionsTable.userId, userId))
      .orderBy(desc(transactionsTable.timestamp));

    return result.map(row => ({
      ...row.transactions,
      asset: row.crypto_assets
    }));
  }

  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const [newTransaction] = await db
      .insert(transactionsTable)
      .values(transaction)
      .returning();
    return newTransaction;
  }
}
