import { Express } from 'express';
import { storage } from '../storage';
import { requireAdmin } from '../auth';

export function registerAdminRoutes(app: Express) {
  app.get('/api/admin/users', requireAdmin, async (req, res) => {
    try {
      const users = await storage.userStorage.getAllUsers();
      res.json(users.map(user => ({
        ...user,
        password: undefined, // Remove password from response
      })));
    } catch (error) {
      console.error('Failed to fetch users:', error);
      res.status(500).json({ message: 'Failed to fetch users' });
    }
  });

  app.get('/api/admin/logs', requireAdmin, async (req, res) => {
    try {
      const logs = await storage.activityLogStorage.getActivityLogs();
      res.json(logs);
    } catch (error) {
      console.error('Failed to fetch activity logs:', error);
      res.status(500).json({ message: 'Failed to fetch activity logs' });
    }
  });

  app.put('/api/admin/users/:id', requireAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }

      const { isAdmin } = req.body;
      if (typeof isAdmin !== 'boolean') {
        return res.status(400).json({ message: 'Invalid data' });
      }

      const updatedUser = await storage.userStorage.updateUserAdmin(userId, isAdmin);
      res.json({
        ...updatedUser,
        password: undefined, // Remove password from response
      });
    } catch (error) {
      console.error('Failed to update user:', error);
      res.status(500).json({ message: 'Failed to update user' });
    }
  });
}
