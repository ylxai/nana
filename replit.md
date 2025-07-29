# Wedibox - Photo Sharing Website

## Overview

Wedibox is a modern photo-sharing website focused on celebrations, particularly weddings. The application allows users to create events quickly, generate shareable links and QR codes, and enable guests to upload photos without requiring accounts. The system is built with a full-stack TypeScript architecture using React for the frontend and Express.js for the backend.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a monorepo structure with clear separation between client, server, and shared code:

- **Frontend**: React-based SPA using Vite as the build tool
- **Backend**: Express.js REST API with TypeScript
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **UI Framework**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query for server state management
- **File Storage**: Local file system with multer for handling uploads

## Key Components

### Frontend Architecture
- **Component Library**: Built on Radix UI primitives with shadcn/ui styling
- **Routing**: Uses wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with custom wedding-themed color palette (ivory and rose gold)
- **Typography**: Playfair Display for headings, Lato for body text
- **Responsive Design**: Mobile-first approach with custom breakpoints

### Backend Architecture
- **API Structure**: RESTful endpoints for events, photos, and messages
- **File Handling**: Multer middleware for photo uploads with 10MB size limit
- **Error Handling**: Centralized error middleware with proper HTTP status codes
- **Logging**: Custom request logging for API endpoints

### Database Schema
The system uses three main entities:
- **Events**: Store event details, QR codes, and shareable links
- **Photos**: Store uploaded photos with metadata and album organization
- **Messages**: Digital guestbook functionality with heart reactions

### Storage Strategy
Currently implements in-memory storage (MemStorage class) with interface (IStorage) designed for easy migration to persistent database storage. The storage layer abstracts CRUD operations for all entities.

## Data Flow

1. **Event Creation**: Users create events with minimal input (name + date), system generates QR codes and shareable links
2. **Guest Access**: Guests access events via QR codes or links without authentication
3. **Photo Upload**: Drag-and-drop interface uploads photos to local storage, metadata stored in database
4. **Digital Guestbook**: Guests can leave messages with heart reaction functionality
5. **Album Organization**: Photos can be organized into multiple albums (ceremony, reception, etc.)

## External Dependencies

### Core Framework Dependencies
- React 18 with TypeScript for frontend development
- Express.js for backend API server
- Drizzle ORM for database operations with PostgreSQL dialect

### UI and Styling
- Tailwind CSS for utility-first styling
- Radix UI primitives for accessible component foundation
- Lucide React for consistent iconography
- Custom fonts: Playfair Display and Lato via Google Fonts

### Development Tools
- Vite for fast development and optimized builds
- ESBuild for server-side bundling
- Replit-specific development plugins for enhanced development experience

### Third-Party Services
- QR code generation via qrserver.com API
- Neon Database for PostgreSQL hosting (configured but not yet implemented)

## Deployment Strategy

The application is configured for deployment on Replit with the following setup:

### Build Process
- Frontend builds to `dist/public` using Vite
- Backend bundles to `dist/index.js` using ESBuild
- Single command deployment with `npm run build`

### Environment Configuration
- Development: Uses tsx for hot-reloading TypeScript server
- Production: Serves static frontend files and runs bundled backend
- Database: Configured for Neon PostgreSQL with environment variable support

### File Structure
- Static assets served from `dist/public`
- Uploaded photos stored in `uploads/` directory
- Database migrations in `migrations/` directory
- Shared types and schemas in `shared/` directory

The application is designed to be easily deployable with minimal configuration while maintaining separation of concerns between frontend and backend code.