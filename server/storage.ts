import { events, photos, messages, type Event, type InsertEvent, type Photo, type InsertPhoto, type Message, type InsertMessage } from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  // Events
  createEvent(event: InsertEvent): Promise<Event>;
  getEvent(id: string): Promise<Event | undefined>;
  getEventByShareableLink(link: string): Promise<Event | undefined>;
  getAllEvents(): Promise<Event[]>;
  deleteEvent(id: string): Promise<void>;
  verifyEventAccessCode(eventId: string, accessCode: string): Promise<boolean>;
  
  // Photos
  addPhoto(photo: InsertPhoto): Promise<Photo>;
  getEventPhotos(eventId: string): Promise<Photo[]>;
  getPhotosByAlbum(eventId: string, albumName: string): Promise<Photo[]>;
  getTotalPhotosCount(): Promise<number>;
  updatePhotoLikes(photoId: string, likes: number): Promise<Photo | undefined>;
  
  // Messages
  addMessage(message: InsertMessage): Promise<Message>;
  getEventMessages(eventId: string): Promise<Message[]>;
  updateMessageHearts(messageId: string, hearts: number): Promise<Message | undefined>;
  getTotalMessagesCount(): Promise<number>;
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
    
    const accessCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const event: Event = {
      ...insertEvent,
      id,
      qrCode,
      shareableLink,
      accessCode,
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
      albumName: insertPhoto.albumName ?? "Tamu",
      uploaderName: insertPhoto.uploaderName ?? null,
      uploadedAt: new Date(),
      likes: 0,
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

  // Admin methods for MemStorage
  async getAllEvents(): Promise<Event[]> {
    return Array.from(this.events.values())
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
  }

  async deleteEvent(id: string): Promise<void> {
    this.events.delete(id);
    // Delete related photos and messages
    Array.from(this.photos.entries()).forEach(([photoId, photo]) => {
      if (photo.eventId === id) {
        this.photos.delete(photoId);
      }
    });
    Array.from(this.messages.entries()).forEach(([messageId, message]) => {
      if (message.eventId === id) {
        this.messages.delete(messageId);
      }
    });
  }

  async getTotalPhotosCount(): Promise<number> {
    return this.photos.size;
  }

  async getTotalMessagesCount(): Promise<number> {
    return this.messages.size;
  }

  async updatePhotoLikes(photoId: string, likes: number): Promise<Photo | undefined> {
    const photo = this.photos.get(photoId);
    if (photo) {
      const updated = { ...photo, likes };
      this.photos.set(photoId, updated);
      return updated;
    }
    return undefined;
  }

  async verifyEventAccessCode(eventId: string, accessCode: string): Promise<boolean> {
    const event = this.events.get(eventId);
    return event ? event.accessCode === accessCode : false;
  }
}

// Database storage implementation
export class DatabaseStorage implements IStorage {
  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const id = randomUUID();
    const accessCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const shareableLink = `https://wedibox.app/event/${id}`;
    const qrCode = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareableLink)}`;
    
    const eventData = {
      ...insertEvent,
      id,
      qrCode,
      shareableLink,
      accessCode,
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
      albumName: insertPhoto.albumName ?? "Tamu",
      uploaderName: insertPhoto.uploaderName ?? null,
      likes: 0,
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

  // Admin methods
  async getAllEvents(): Promise<Event[]> {
    return db.select().from(events).orderBy(desc(events.createdAt));
  }

  async deleteEvent(id: string): Promise<void> {
    // Delete related photos and messages first
    await db.delete(photos).where(eq(photos.eventId, id));
    await db.delete(messages).where(eq(messages.eventId, id));
    await db.delete(events).where(eq(events.id, id));
  }

  async getTotalPhotosCount(): Promise<number> {
    const result = await db.select({ count: sql<number>`count(*)` }).from(photos);
    return result[0]?.count || 0;
  }

  async getTotalMessagesCount(): Promise<number> {
    const result = await db.select({ count: sql<number>`count(*)` }).from(messages);
    return result[0]?.count || 0;
  }

  async updatePhotoLikes(photoId: string, likes: number): Promise<Photo | undefined> {
    const [photo] = await db
      .update(photos)
      .set({ likes })
      .where(eq(photos.id, photoId))
      .returning();
    return photo || undefined;
  }

  async verifyEventAccessCode(eventId: string, accessCode: string): Promise<boolean> {
    const [event] = await db.select().from(events)
      .where(and(eq(events.id, eventId), eq(events.accessCode, accessCode)));
    return !!event;
  }

  async updateMessageHearts(messageId: string, hearts: number): Promise<Message | undefined> {
    const [message] = await db
      .update(messages)
      .set({ hearts })
      .where(eq(messages.id, messageId))
      .returning();
    return message || undefined;
  }

  async getRecentPhotos(limit: number = 20): Promise<Photo[]> {
    return await db
      .select()
      .from(photos)
      .orderBy(desc(photos.createdAt))
      .limit(limit);
  }

  async deletePhoto(photoId: string): Promise<void> {
    // Delete the file from filesystem
    const photo = await db.select().from(photos).where(eq(photos.id, photoId)).limit(1);
    if (photo[0]?.url) {
      const fs = require('fs');
      const path = require('path');
      const filePath = path.join(process.cwd(), 'uploads', path.basename(photo[0].url));
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (error) {
        console.error('Error deleting file:', error);
      }
    }

    // Delete from database
    await db.delete(photos).where(eq(photos.id, photoId));
  }
}

export const storage = new DatabaseStorage();
