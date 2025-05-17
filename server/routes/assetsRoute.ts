import { Express } from "express";
import { storage } from "../storage";

export function registerAssetRoutes(app: Express) {
  app.get("/api/assets", async (req, res) => {
    try {
      const assets = await storage.cryptoAssetStorage.getAllCryptoAssets();
      res.json(assets);
    } catch (error) {
      console.error('Failed to fetch crypto assets:', error);
      res.status(500).json({ message: "Failed to fetch crypto assets" });
    }
  });
}
