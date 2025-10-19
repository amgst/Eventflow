import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertEventSchema, insertRsvpSchema } from "../shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth endpoints
  app.post("/api/login", async (req, res) => {
    const { username, password, remember } = req.body || {};
    const HARD_USER = process.env.AUTH_USER || "admin";
    const HARD_PASS = process.env.AUTH_PASS || "secret123";
    const sess = (req as any).session;
    if (username === HARD_USER && password === HARD_PASS) {
      if (sess) {
        sess.user = { username };
        // Adjust cookie based on remember flag
        if (typeof remember !== "undefined") {
          if (remember) {
            // 30 days persistent session
            sess.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
          } else {
            // Session-only cookie (expires when browser closes)
            sess.cookie.expires = false as any;
            sess.cookie.maxAge = undefined as any;
          }
        }
      }
      return res.json({ username });
    }
    return res.status(401).json({ error: "Invalid credentials" });
  });

  app.post("/api/logout", async (req, res) => {
    const sess = (req as any).session;
    if (!sess) return res.status(204).send();
    sess.destroy((err: any) => {
      if (err) return res.status(500).json({ error: "Failed to logout" });
      return res.status(204).send();
    });
  });

  app.get("/api/me", async (req, res) => {
    const sessUser = (req as any).session?.user;
    if (!sessUser) return res.status(401).json({ error: "Unauthorized" });
    return res.json(sessUser);
  });

  app.get("/api/events", async (_req, res) => {
    try {
      const events = await storage.getAllEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch events" });
    }
  });

  app.get("/api/events/:id", async (req, res) => {
    try {
      const event = await storage.getEvent(req.params.id);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch event" });
    }
  });

  app.post("/api/events", async (req, res) => {
    try {
      const validatedData = insertEventSchema.parse(req.body);
      const event = await storage.createEvent(validatedData);
      res.status(201).json(event);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Failed to create event" });
      }
    }
  });

  app.get("/api/rsvps", async (_req, res) => {
    try {
      const allRsvps = await storage.getAllRsvps();
      res.json(allRsvps);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch RSVPs" });
    }
  });

  app.post("/api/rsvps", async (req, res) => {
    try {
      const validatedData = insertRsvpSchema.parse(req.body);
      
      const event = await storage.getEvent(validatedData.eventId);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }

      const existingRsvps = await storage.getRsvpsByEvent(validatedData.eventId);
      if (existingRsvps.length >= event.capacity) {
        return res.status(400).json({ error: "Event is at full capacity" });
      }

      const rsvp = await storage.createRsvp(validatedData);
      res.status(201).json(rsvp);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Failed to create RSVP" });
      }
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
