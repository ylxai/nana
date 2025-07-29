# Wedibox - Photo Sharing Website

## Overview

Wedibox is a modern photo-sharing website focused on celebrations, particularly weddings. The application allows users to create events quickly, generate shareable links and QR codes, and enable guests to upload photos without requiring accounts. Features include instant event creation, guest photo uploads, digital guestbook functionality, multi-album support, wedding slideshow capabilities, and comprehensive admin management. The system is built with a full-stack TypeScript architecture using React for the frontend, Express.js for the backend, and PostgreSQL for persistent data storage.

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
Now implements persistent PostgreSQL database storage (DatabaseStorage class) using Drizzle ORM for type-safe database operations. The storage layer abstracts CRUD operations for all entities. Migrated from in-memory storage on July 29, 2025 for data persistence and scalability.

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
- PostgreSQL database with Neon for reliable data persistence

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

## Recent Changes

- **July 29, 2025**: Migrated from in-memory storage to PostgreSQL database
  - Added database connection layer with Neon PostgreSQL
  - Implemented DatabaseStorage class using Drizzle ORM
  - Pushed database schema with events, photos, and messages tables
  - All data now persists between application restarts

- **July 29, 2025**: Completed comprehensive admin dashboard
  - Added secure admin authentication (username: admin, password: klp123)
  - Implemented real-time statistics dashboard with live database data
  - Created complete event management with view, delete, and export capabilities
  - Added admin API endpoints for system management and analytics
  - Integrated admin access button in main application header
  - Full CRUD operations for events with automatic cascade deletion

The application is designed to be easily deployable with minimal configuration while maintaining separation of concerns between frontend and backend code.