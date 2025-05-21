import { UserStorage } from './userStorage';
import { PortfolioStorage } from './portfolioStorage';
import { PortfolioAssetStorage } from './portfolioAssetStorage';
import { TransactionStorage } from './transactionStorage';
import { CryptoAssetStorage } from './cryptoAssetStorage';
import { ActivityLogStorage } from './activityLogStorage';
import { SessionStorage } from './sessionStorage';

export const storage = {
  userStorage: new UserStorage(),
  portfolioStorage: new PortfolioStorage(),
  portfolioAssetStorage: new PortfolioAssetStorage(),
  transactionStorage: new TransactionStorage(),
  cryptoAssetStorage: new CryptoAssetStorage(),
  activityLogStorage: new ActivityLogStorage(),
  sessionStore: new SessionStorage().sessionStore,
};
