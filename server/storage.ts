import { type Event, type InsertEvent, type Rsvp, type InsertRsvp } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getAllEvents(): Promise<Event[]>;
  getEvent(id: string): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  deleteEvent(id: string): Promise<boolean>;
  
  getAllRsvps(): Promise<Rsvp[]>;
  getRsvpsByEvent(eventId: string): Promise<Rsvp[]>;
  createRsvp(rsvp: InsertRsvp): Promise<Rsvp>;
}

export class MemStorage implements IStorage {
  private events: Map<string, Event>;
  private rsvps: Map<string, Rsvp>;

  constructor() {
    this.events = new Map();
    this.rsvps = new Map();
    this.seedInitialData();
  }

  private seedInitialData() {
    const sampleEvents: Event[] = [
      {
        id: randomUUID(),
        title: "Summer Music Festival 2025",
        description: "Join us for an unforgettable evening of live music featuring local and international artists. Experience diverse genres from rock to electronic, food trucks, and an amazing atmosphere under the stars.",
        category: "Music",
        date: "2025-07-15",
        time: "18:00",
        location: "Central Park Amphitheater, New York, NY",
        capacity: 500,
        imageUrl: "/generated_images/Concert_event_card_image_14e6171b.png",
        organizerName: "Music Events Co",
        organizerEmail: "info@musicevents.com",
      },
      {
        id: randomUUID(),
        title: "Web Development Workshop",
        description: "Learn modern web development with React, TypeScript, and Tailwind CSS. This hands-on workshop covers best practices, component design, and building production-ready applications. Suitable for intermediate developers.",
        category: "Workshop",
        date: "2025-06-20",
        time: "10:00",
        location: "Tech Hub Conference Center, San Francisco, CA",
        capacity: 50,
        imageUrl: "/generated_images/Workshop_event_card_image_2b0c5e55.png",
        organizerName: "CodeCraft Academy",
        organizerEmail: "workshops@codecraft.io",
      },
      {
        id: randomUUID(),
        title: "City Marathon 2025",
        description: "Annual charity marathon supporting local youth programs. Choose from 5K, 10K, or full marathon distances. All fitness levels welcome! Registration includes race pack, finisher medal, and post-race refreshments.",
        category: "Sports",
        date: "2025-08-10",
        time: "07:00",
        location: "Downtown Start Line, Chicago, IL",
        capacity: 1000,
        imageUrl: "/generated_images/Sports_event_card_image_43a10072.png",
        organizerName: "City Sports Foundation",
        organizerEmail: "marathon@citysports.org",
      },
      {
        id: randomUUID(),
        title: "International Food Festival",
        description: "Celebrate global cuisine with food vendors from 30+ countries. Live cultural performances, cooking demonstrations, and family-friendly activities throughout the day. Don't miss this culinary journey around the world!",
        category: "Cultural",
        date: "2025-09-05",
        time: "12:00",
        location: "Riverside Plaza, Portland, OR",
        capacity: 300,
        imageUrl: "/generated_images/Cultural_festival_card_image_3c425a6a.png",
        organizerName: "Cultural Exchange Society",
        organizerEmail: "events@culturalexchange.org",
      },
      {
        id: randomUUID(),
        title: "Startup Networking Mixer",
        description: "Connect with fellow entrepreneurs, investors, and industry leaders. Pitch your ideas, find co-founders, and build valuable relationships in the startup ecosystem. Light refreshments and drinks provided.",
        category: "Networking",
        date: "2025-06-01",
        time: "18:30",
        location: "Innovation Hub, Austin, TX",
        capacity: 100,
        imageUrl: "/generated_images/Networking_event_card_image_37addecf.png",
        organizerName: "Startup Connect",
        organizerEmail: "hello@startupconnect.com",
      },
      {
        id: randomUUID(),
        title: "Contemporary Art Exhibition",
        description: "Featuring emerging artists from around the region. Explore thought-provoking installations, paintings, and sculptures. Opening night includes artist talks and wine reception. Gallery hours extended for this special exhibition.",
        category: "Art",
        date: "2025-07-01",
        time: "19:00",
        location: "Modern Art Gallery, Seattle, WA",
        capacity: 150,
        imageUrl: "/generated_images/Art_event_card_image_aa1c3542.png",
        organizerName: "Modern Art Collective",
        organizerEmail: "gallery@modernart.org",
      },
    ];

    sampleEvents.forEach(event => {
      this.events.set(event.id, event);
    });

    const sampleRsvps: Rsvp[] = [
      { id: randomUUID(), eventId: sampleEvents[0].id, attendeeName: "Alice Johnson", attendeeEmail: "alice@example.com" },
      { id: randomUUID(), eventId: sampleEvents[0].id, attendeeName: "Bob Smith", attendeeEmail: "bob@example.com" },
      { id: randomUUID(), eventId: sampleEvents[0].id, attendeeName: "Carol White", attendeeEmail: "carol@example.com" },
      { id: randomUUID(), eventId: sampleEvents[1].id, attendeeName: "David Brown", attendeeEmail: "david@example.com" },
      { id: randomUUID(), eventId: sampleEvents[1].id, attendeeName: "Emma Davis", attendeeEmail: "emma@example.com" },
      { id: randomUUID(), eventId: sampleEvents[2].id, attendeeName: "Frank Miller", attendeeEmail: "frank@example.com" },
    ];

    sampleRsvps.forEach(rsvp => {
      this.rsvps.set(rsvp.id, rsvp);
    });
  }

  async getAllEvents(): Promise<Event[]> {
    return Array.from(this.events.values()).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }

  async getEvent(id: string): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const id = randomUUID();
    const event: Event = { ...insertEvent, id };
    this.events.set(id, event);
    return event;
  }

  async deleteEvent(id: string): Promise<boolean> {
    return this.events.delete(id);
  }

  async getAllRsvps(): Promise<Rsvp[]> {
    return Array.from(this.rsvps.values());
  }

  async getRsvpsByEvent(eventId: string): Promise<Rsvp[]> {
    return Array.from(this.rsvps.values()).filter(
      (rsvp) => rsvp.eventId === eventId
    );
  }

  async createRsvp(insertRsvp: InsertRsvp): Promise<Rsvp> {
    const id = randomUUID();
    const rsvp: Rsvp = { ...insertRsvp, id };
    this.rsvps.set(id, rsvp);
    return rsvp;
  }
}

export const storage = new MemStorage();
