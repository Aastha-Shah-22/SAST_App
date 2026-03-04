import express from 'express';
import cors from 'cors';
import scanRoutes from './routes/scan_routes.js';


function createApp() {
  const app = express();

  // Global middleware
  app.use(cors());
  app.use(express.json());

  // Health check
  app.get("/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // API routes
  app.use("/api", scanRoutes);

  return app;
}

module.exports = { createApp };

