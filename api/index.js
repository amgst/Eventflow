import express from "express";
import session from "express-session";
import path from "path";
import fs from "fs";
import { randomUUID } from "crypto";
import connectMemorystore from "memorystore";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files from Vite build (not strictly needed for API function)
app.use(express.static(path.join(process.cwd(), "dist", "public")));

// Basic session for demo (not durable in serverless)
const Memorystore = connectMemorystore(session);
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
    store: new Memorystore({ checkPeriod: 86400000 }),
  })
);

// In-memory store seeded from bundled JSON files (read-only seed)
let eventsMap = new Map();
let rsvpsMap = new Map();

function readJson(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      const txt = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(txt || "[]");
    }
  } catch (_) {}
  return [];
}

function seedFromJson() {
  const eventsFile = path.resolve(process.cwd(), "server", "data", "events.json");
  const rsvpsFile = path.resolve(process.cwd(), "server", "data", "rsvps.json");
  const eventsArr = readJson(eventsFile);
  const rsvpsArr = readJson(rsvpsFile);
  eventsMap = new Map(eventsArr.map(e => [e.id, e]));
  rsvpsMap = new Map(rsvpsArr.map(r => [r.id, r]));
}

function getAllEvents() {
  return Array.from(eventsMap.values()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

function getEvent(id) {
  return eventsMap.get(id);
}

function createEvent(insertEvent) {
  const id = randomUUID();
  const event = { ...insertEvent, id };
  eventsMap.set(id, event);
  return event;
}

function deleteEvent(id) {
  const existed = eventsMap.has(id);
  eventsMap.delete(id);
  return existed;
}

function getAllRsvps() {
  return Array.from(rsvpsMap.values());
}

function getRsvpsByEvent(eventId) {
  return Array.from(rsvpsMap.values()).filter(r => r.eventId === eventId);
}

function createRsvp(insertRsvp) {
  const id = randomUUID();
  const rsvp = { ...insertRsvp, id };
  rsvpsMap.set(id, rsvp);
  return rsvp;
}

let initialized = false;
async function ensureInitialized() {
  if (!initialized) {
    seedFromJson();

    // Auth endpoints
    app.post("/api/login", async (req, res) => {
      const { username, password, remember } = req.body || {};
      const HARD_USER = process.env.AUTH_USER || "admin";
      const HARD_PASS = process.env.AUTH_PASS || "secret123";
      const sess = req.session;
      if (username === HARD_USER && password === HARD_PASS) {
        if (sess) {
          sess.user = { username };
          if (typeof remember !== "undefined") {
            if (remember) {
              sess.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
            } else {
              sess.cookie.expires = false;
              sess.cookie.maxAge = undefined;
            }
          }
        }
        return res.json({ username });
      }
      return res.status(401).json({ error: "Invalid credentials" });
    });

    app.post("/api/logout", async (req, res) => {
      const sess = req.session;
      if (!sess) return res.status(204).send();
      sess.destroy(err => {
        if (err) return res.status(500).json({ error: "Failed to logout" });
        return res.status(204).send();
      });
    });

    app.get("/api/me", async (req, res) => {
      const sessUser = req.session?.user;
      if (!sessUser) return res.status(401).json({ error: "Unauthorized" });
      return res.json(sessUser);
    });

    // Events
    app.get("/api/events", async (_req, res) => {
      try {
        const events = getAllEvents();
        res.json(events);
      } catch (_) {
        res.status(500).json({ error: "Failed to fetch events" });
      }
    });

    app.get("/api/events/:id", async (req, res) => {
      try {
        const event = getEvent(req.params.id);
        if (!event) {
          return res.status(404).json({ error: "Event not found" });
        }
        res.json(event);
      } catch (_) {
        res.status(500).json({ error: "Failed to fetch event" });
      }
    });

    app.post("/api/events", async (req, res) => {
      try {
        const insertEvent = req.body;
        const event = createEvent(insertEvent);
        res.status(201).json(event);
      } catch (error) {
        res.status(400).json({ error: error?.message || "Failed to create event" });
      }
    });

    // RSVPs
    app.get("/api/rsvps", async (_req, res) => {
      try {
        const allRsvps = getAllRsvps();
        res.json(allRsvps);
      } catch (_) {
        res.status(500).json({ error: "Failed to fetch RSVPs" });
      }
    });

    app.post("/api/rsvps", async (req, res) => {
      try {
        const insertRsvp = req.body;
        const event = getEvent(insertRsvp.eventId);
        if (!event) {
          return res.status(404).json({ error: "Event not found" });
        }
        const existingRsvps = getRsvpsByEvent(insertRsvp.eventId);
        if (existingRsvps.length >= (event.capacity ?? Number.MAX_SAFE_INTEGER)) {
          return res.status(400).json({ error: "Event is at full capacity" });
        }
        const rsvp = createRsvp(insertRsvp);
        res.status(201).json(rsvp);
      } catch (error) {
        res.status(400).json({ error: error?.message || "Failed to create RSVP" });
      }
    });

    initialized = true;
  }
}

export default async function handler(req, res) {
  await ensureInitialized();
  return app(req, res);
}