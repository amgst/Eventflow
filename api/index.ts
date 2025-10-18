import express from "express";
import session from "express-session";
import path from "path";
import registerRoutes from "../server/routes";
import MemoryStore from "memorystore"(session);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files from Vite build
app.use(express.static(path.join(process.cwd(), "dist", "public")));

// Basic session for demo (not durable in serverless)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "change-this-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    },
    store: new MemoryStore({ checkPeriod: 86400000 }),
  })
);

let initialized = false;
async function ensureInitialized() {
  if (!initialized) {
    await registerRoutes(app);
    initialized = true;
  }
}

export default async function handler(req: any, res: any) {
  await ensureInitialized();
  return app(req, res);
}