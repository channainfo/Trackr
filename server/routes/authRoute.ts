import { Express } from 'express';
import { setupAuth } from '../auth';

export function registerAuthRoutes(app: Express) {
  setupAuth(app);
}
