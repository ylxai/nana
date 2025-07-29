import { events, photos, messages, type Event, type InsertEvent, type Photo, type InsertPhoto, type Message, type InsertMessage } from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  // Events
  createEvent(event: InsertEvent): Promise<Event>;
  getEvent(id: string): Promise<Event | undefined>;
  getEventByShareableLink(link: string): Promise<Event | undefined>;
  
  // Photos
  addPhoto(photo: InsertPhoto): Promise<Photo>;
  getEventPhotos(eventId: string): Promise<Photo[]>;
  getPhotosByAlbum(eventId: string, albumName: string): Promise<Photo[]>;
  
  // Messages
  addMessage(message: InsertMessage): Promise<Message>;
  getEventMessages(eventId: string): Promise<Message[]>;
  updateMessageHearts(messageId: string, hearts: number): Promise<Message | undefined>;
}

export class MemStorage implements IStorage {
  private events: Map<string, Event>;
  private photos: Map<string, Photo>;
  private messages: Map<string, Message>;

  constructor() {
    this.events = new Map();
    this.photos = new Map();
    this.messages = new Map();
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const id = randomUUID();
    const shareableLink = `https://wedibox.app/event/${id}`;
    const qrCode = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareableLink)}`;
    
    const event: Event = {
      ...insertEvent,
      id,
      qrCode,
      shareableLink,
      isPremium: insertEvent.isPremium ?? false,
      createdAt: new Date(),
    };
    
    this.events.set(id, event);
    return event;
  }

  async getEvent(id: string): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async getEventByShareableLink(link: string): Promise<Event | undefined> {
    return Array.from(this.events.values()).find(event => event.shareableLink === link);
  }

  async addPhoto(insertPhoto: InsertPhoto): Promise<Photo> {
    const id = randomUUID();
    const photo: Photo = {
      ...insertPhoto,
      id,
      albumName: insertPhoto.albumName ?? "Main",
      uploaderName: insertPhoto.uploaderName ?? null,
      uploadedAt: new Date(),
    };
    
    this.photos.set(id, photo);
    return photo;
  }

  async getEventPhotos(eventId: string): Promise<Photo[]> {
    return Array.from(this.photos.values())
      .filter(photo => photo.eventId === eventId)
      .sort((a, b) => b.uploadedAt!.getTime() - a.uploadedAt!.getTime());
  }

  async getPhotosByAlbum(eventId: string, albumName: string): Promise<Photo[]> {
    return Array.from(this.photos.values())
      .filter(photo => photo.eventId === eventId && photo.albumName === albumName)
      .sort((a, b) => b.uploadedAt!.getTime() - a.uploadedAt!.getTime());
  }

  async addMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = randomUUID();
    const message: Message = {
      ...insertMessage,
      id,
      hearts: 0,
      createdAt: new Date(),
    };
    
    this.messages.set(id, message);
    return message;
  }

  async getEventMessages(eventId: string): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(message => message.eventId === eventId)
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
  }

  async updateMessageHearts(messageId: string, hearts: number): Promise<Message | undefined> {
    const message = this.messages.get(messageId);
    if (message) {
      const updated = { ...message, hearts };
      this.messages.set(messageId, updated);
      return updated;
    }
    return undefined;
  }
}

// Database storage implementation
export class DatabaseStorage implements IStorage {
  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const id = randomUUID();
    const shareableLink = `https://wedibox.app/event/${id}`;
    const qrCode = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareableLink)}`;
    
    const eventData = {
      ...insertEvent,
      id,
      qrCode,
      shareableLink,
      isPremium: insertEvent.isPremium ?? false,
    };

    const [event] = await db
      .insert(events)
      .values(eventData)
      .returning();
    return event;
  }

  async getEvent(id: string): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event || undefined;
  }

  async getEventByShareableLink(link: string): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.shareableLink, link));
    return event || undefined;
  }

  async addPhoto(insertPhoto: InsertPhoto): Promise<Photo> {
    const id = randomUUID();
    const photoData = {
      ...insertPhoto,
      id,
      albumName: insertPhoto.albumName ?? "Main",
      uploaderName: insertPhoto.uploaderName ?? null,
    };

    const [photo] = await db
      .insert(photos)
      .values(photoData)
      .returning();
    return photo;
  }

  async getEventPhotos(eventId: string): Promise<Photo[]> {
    return db.select().from(photos)
      .where(eq(photos.eventId, eventId))
      .orderBy(desc(photos.uploadedAt));
  }

  async getPhotosByAlbum(eventId: string, albumName: string): Promise<Photo[]> {
    return db.select().from(photos)
      .where(and(eq(photos.eventId, eventId), eq(photos.albumName, albumName)))
      .orderBy(desc(photos.uploadedAt));
  }

  async addMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = randomUUID();
    const messageData = {
      ...insertMessage,
      id,
      hearts: 0,
    };

    const [message] = await db
      .insert(messages)
      .values(messageData)
      .returning();
    return message;
  }

  async getEventMessages(eventId: string): Promise<Message[]> {
    return db.select().from(messages)
      .where(eq(messages.eventId, eventId))
      .orderBy(desc(messages.createdAt));
  }

  async updateMessageHearts(messageId: string, hearts: number): Promise<Message | undefined> {
    const [message] = await db
      .update(messages)
      .set({ hearts })
      .where(eq(messages.id, messageId))
      .returning();
    return message || undefined;
  }
}

export const storage = new DatabaseStorage();
