import { Express } from 'express';
import { storage } from '../storage';
import { requireAuth } from '../auth';
import { insertPortfolioSchema, User } from '@shared/schema';
import { z } from 'zod';

export function registerPortfolioRoutes(app: Express) {
  app.get('/api/portfolios', requireAuth, async (req, res) => {
    try {
      const portfolios = await storage.portfolioStorage.getUserPortfolios((req.user as User).id);
      res.json(portfolios);
    } catch (error) {
      console.error('Failed to fetch portfolios:', error);
      res.status(500).json({ message: 'Failed to fetch portfolios' });
    }
  });

  app.get('/api/portfolios/:id', requireAuth, async (req, res) => {
    try {
      const portfolioId = parseInt(req.params.id);
      if (isNaN(portfolioId)) {
        return res.status(400).json({ message: 'Invalid portfolio ID' });
      }

      const portfolio = await storage.portfolioStorage.getPortfolio(portfolioId);

      if (!portfolio || portfolio.userId !== (req.user as User).id) {
        return res.status(404).json({ message: 'Portfolio not found' });
      }

      res.json(portfolio);
    } catch (error) {
      console.error('Failed to fetch portfolio:', error);
      res.status(500).json({ message: 'Failed to fetch portfolio' });
    }
  });

  app.post('/api/portfolios', requireAuth, async (req, res) => {
    try {
      const validatedData = insertPortfolioSchema.parse({ ...req.body, userId: (req.user as User).id });
      const newPortfolio = await storage.portfolioStorage.createPortfolio(validatedData);
      res.status(201).json(newPortfolio);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Validation error', errors: error.errors });
      }
      console.error('Failed to create portfolio:', error);
      res.status(500).json({ message: 'Failed to create portfolio' });
    }
  });
}
