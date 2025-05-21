import { Express } from 'express';
import { storage } from '../storage';
import { requireAuth } from '../auth';
import { insertPortfolioAssetSchema, User } from '@shared/schema';
import { z } from 'zod';

export function registerPortfolioAssetRoutes(app: Express) {
  app.get('/api/portfolios/:id/assets', requireAuth, async (req, res) => {
    try {
      const portfolioId = parseInt(req.params.id);
      if (isNaN(portfolioId)) {
        return res.status(400).json({ message: 'Invalid portfolio ID' });
      }

      const portfolio = await storage.portfolioStorage.getPortfolio(portfolioId);
      if (!portfolio || portfolio.userId !== (req.user as User).id) {
        return res.status(404).json({ message: 'Portfolio not found' });
      }

      const assets = await storage.portfolioAssetStorage.getPortfolioAssets(portfolioId);
      res.json(assets);
    } catch (error) {
      console.error('Failed to fetch portfolio assets:', error);
      res.status(500).json({ message: 'Failed to fetch portfolio assets' });
    }
  });

  app.post('/api/portfolios/:id/assets', requireAuth, async (req, res) => {
    try {
      const portfolioId = parseInt(req.params.id);
      if (isNaN(portfolioId)) {
        return res.status(400).json({ message: 'Invalid portfolio ID' });
      }

      const portfolio = await storage.portfolioStorage.getPortfolio(portfolioId);
      if (!portfolio || portfolio.userId !== (req.user as User).id) {
        return res.status(404).json({ message: 'Portfolio not found' });
      }

      const validatedData = insertPortfolioAssetSchema.parse({
        ...req.body,
        portfolioId,
      });

      const newAsset = await storage.portfolioAssetStorage.addPortfolioAsset(validatedData);
      res.status(201).json(newAsset);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Validation error', errors: error.errors });
      }
      console.error('Failed to add portfolio asset:', error);
      res.status(500).json({ message: 'Failed to add portfolio asset' });
    }
  });
}
