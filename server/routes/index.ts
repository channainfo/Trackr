import { Express } from 'express';
import { registerAuthRoutes } from './authRoute';
import { registerPortfolioRoutes } from './portfoliosRoute';
import { registerPortfolioAssetRoutes } from './portfolioAssetsRoute';
import { registerTransactionRoutes } from './transactionsRoute';
import { registerAssetRoutes } from './assetsRoute';
import { registerAdminRoutes } from './adminRoute';
import { createServer, type Server } from 'http';

export async function registerRoutes(app: Express): Promise<Server> {
  // Register all routes
  registerAuthRoutes(app);
  registerPortfolioRoutes(app);
  registerPortfolioAssetRoutes(app);
  registerTransactionRoutes(app);
  registerAssetRoutes(app);
  registerAdminRoutes(app);

  const httpServer = createServer(app);
  return httpServer;
}
