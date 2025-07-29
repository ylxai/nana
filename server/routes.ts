import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertEventSchema, insertPhotoSchema, insertMessageSchema } from "@shared/schema";
import multer from "multer";
import path from "path";

const upload = multer({ 
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Create event
  app.post("/api/events", async (req, res) => {
    try {
      const validatedData = insertEventSchema.parse(req.body);
      const event = await storage.createEvent(validatedData);
      res.json(event);
    } catch (error) {
      res.status(400).json({ message: "Invalid event data", error });
    }
  });

  // Get event by ID
  app.get("/api/events/:id", async (req, res) => {
    try {
      const event = await storage.getEvent(req.params.id);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });

  // Upload photo
  app.post("/api/events/:eventId/photos", upload.single('photo'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const photoData = {
        eventId: req.params.eventId,
        filename: req.file.filename,
        originalName: req.file.originalname,
        url: `/uploads/${req.file.filename}`,
        uploaderName: req.body.uploaderName || "Anonymous",
        albumName: req.body.albumName || "Main",
      };

      const validatedData = insertPhotoSchema.parse(photoData);
      const photo = await storage.addPhoto(validatedData);
      res.json(photo);
    } catch (error) {
      res.status(400).json({ message: "Failed to upload photo", error });
    }
  });

  // Get event photos
  app.get("/api/events/:eventId/photos", async (req, res) => {
    try {
      const photos = await storage.getEventPhotos(req.params.eventId);
      res.json(photos);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });

  // Get photos by album
  app.get("/api/events/:eventId/albums/:albumName/photos", async (req, res) => {
    try {
      const photos = await storage.getPhotosByAlbum(req.params.eventId, req.params.albumName);
      res.json(photos);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });

  // Add message
  app.post("/api/events/:eventId/messages", async (req, res) => {
    try {
      const messageData = {
        eventId: req.params.eventId,
        guestName: req.body.guestName,
        message: req.body.message,
      };

      const validatedData = insertMessageSchema.parse(messageData);
      const message = await storage.addMessage(validatedData);
      res.json(message);
    } catch (error) {
      res.status(400).json({ message: "Failed to add message", error });
    }
  });

  // Get event messages
  app.get("/api/events/:eventId/messages", async (req, res) => {
    try {
      const messages = await storage.getEventMessages(req.params.eventId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });

  // Update message hearts
  app.patch("/api/messages/:messageId/hearts", async (req, res) => {
    try {
      const { hearts } = req.body;
      const message = await storage.updateMessageHearts(req.params.messageId, hearts);
      if (!message) {
        return res.status(404).json({ message: "Message not found" });
      }
      res.json(message);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });

  // Verify event access code
  app.post("/api/events/:eventId/verify-code", async (req, res) => {
    try {
      const { accessCode } = req.body;
      const isValid = await storage.verifyEventAccessCode(req.params.eventId, accessCode);
      res.json({ valid: isValid });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });

  // Update photo likes
  app.patch("/api/photos/:photoId/likes", async (req, res) => {
    try {
      const { likes } = req.body;
      const photo = await storage.updatePhotoLikes(req.params.photoId, likes);
      if (!photo) {
        return res.status(404).json({ message: "Photo not found" });
      }
      res.json(photo);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });

  // Admin routes
  app.get("/api/admin/stats", async (req, res) => {
    try {
      // Get statistics from database
      const events = await storage.getAllEvents();
      const totalPhotos = await storage.getTotalPhotosCount();
      const totalMessages = await storage.getTotalMessagesCount();
      
      const stats = {
        totalEvents: events.length,
        totalPhotos,
        totalMessages,
        activeEvents: events.filter(e => new Date(e.date) >= new Date()).length,
        storageUsed: "2.4 GB" // This would be calculated from actual storage
      };
      
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });

  app.get("/api/admin/events", async (req, res) => {
    try {
      const events = await storage.getAllEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });

  app.delete("/api/admin/events/:id", async (req, res) => {
    try {
      await storage.deleteEvent(req.params.id);
      res.json({ message: "Event deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });

  // Serve uploaded files
  app.use('/uploads', express.static('uploads'));

  const httpServer = createServer(app);
  return httpServer;
}
