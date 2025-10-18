import express from "express";
import session from "express-session";
import connectMemorystore from "memorystore";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { registerRoutes } from "../server/routes";

// Initialize Express app once per function instance
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const Memorystore = connectMemorystore(session);
app.use(
  session({
    store: new Memorystore({ checkPeriod: 86400000 }),
    secret: process.env.SESSION_SECRET || "prod-secret",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 14 * 24 * 60 * 60 * 1000 },
  })
);

// Register routes (reuses the same route definitions as local dev)
await registerRoutes(app);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Delegate request handling to Express
  return app(req as any, res as any);
}