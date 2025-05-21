import { db } from '../db';
import { cryptoAssetsTable } from '@shared/schema';
import { CryptoAsset } from '@shared/schema';
import { eq } from 'drizzle-orm';

export class CryptoAssetStorage {
  async getAllCryptoAssets(): Promise<CryptoAsset[]> {
    return await db.select().from(cryptoAssetsTable);
  }

  async getCryptoAsset(id: number): Promise<CryptoAsset | undefined> {
    const [asset] = await db
      .select()
      .from(cryptoAssetsTable)
      .where(eq(cryptoAssetsTable.id, id));
    return asset || undefined;
  }
}
