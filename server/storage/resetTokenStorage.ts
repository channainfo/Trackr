import { db } from '../db';
import { resetTokensTable } from '@shared/schema';
import { InsertResetToken, ResetToken } from '@shared/schema';
import { eq, and, lt } from 'drizzle-orm';

export class ResetTokenStorage {
  async createToken(token: InsertResetToken): Promise<ResetToken> {
    const [newToken] = await db.insert(resetTokensTable).values(token).returning();
    return newToken;
  }

  async getTokenByToken(token: string): Promise<ResetToken | undefined> {
    const [resetToken] = await db
      .select()
      .from(resetTokensTable)
      .where(eq(resetTokensTable.token, token));
    return resetToken || undefined;
  }

  async getValidTokenByEmail(email: string): Promise<ResetToken | undefined> {
    const now = new Date();
    const [resetToken] = await db
      .select()
      .from(resetTokensTable)
      .where(
        and(
          eq(resetTokensTable.email, email),
          lt(resetTokensTable.expiresAt, now)
        )
      );
    return resetToken || undefined;
  }

  async invalidateToken(token: string): Promise<void> {
    await db
      .delete(resetTokensTable)
      .where(eq(resetTokensTable.token, token));
  }

  async cleanupExpiredTokens(): Promise<void> {
    const now = new Date();
    await db
      .delete(resetTokensTable)
      .where(lt(resetTokensTable.expiresAt, now));
  }
}
