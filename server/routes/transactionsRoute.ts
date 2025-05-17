import { Express } from "express";
import { storage } from "../storage";
import { requireAuth } from "../auth";
import { insertTransactionSchema, User } from "@shared/schema";
import { z } from "zod";

export function registerTransactionRoutes(app: Express) {
  app.get("/api/transactions", requireAuth, async (req, res) => {
    try {
      const transactions = await storage.transactionStorage.getUserTransactions((req.user as User).id);
      res.json(transactions);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  app.post("/api/transactions", requireAuth, async (req, res) => {
    try {
      const validatedData = insertTransactionSchema.parse({
        ...req.body,
        userId: (req.user as User).id
      });

      const newTransaction = await storage.transactionStorage.createTransaction(validatedData);
      res.status(201).json(newTransaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error('Failed to create transaction:', error);
      res.status(500).json({ message: "Failed to create transaction" });
    }
  });
}
