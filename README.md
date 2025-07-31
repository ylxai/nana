# Hafi Portrait - Next.js Application

Platform berbagi foto untuk event dan acara spesial yang telah dimigrasikan dari Vite/Express ke Next.js.

## 🚀 Fitur Utama

- **Upload Foto Mudah**: Interface sederhana untuk upload foto langsung dari smartphone
- **Berbagi Instan**: Bagikan galeri dengan tamu melalui link atau QR code
- **Event Management**: Kelola multiple event dengan sistem akses yang aman
- **Admin Dashboard**: Panel admin untuk monitoring dan manajemen
- **Mobile Responsive**: Optimized untuk semua perangkat mobile dan desktop
- **Real-time Updates**: Update foto dan pesan secara real-time

## 🛠️ Tech Stack

- **Framework**: Next.js 14 dengan App Router
- **Database**: PostgreSQL dengan Drizzle ORM
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **State Management**: React Query (TanStack Query)
- **File Upload**: Next.js native file handling
- **Hosting**: Vercel-ready

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm atau yarn

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hafiportrait-nextjs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` dengan konfigurasi database Anda:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/hafiportrait"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

4. **Set up database**
   ```bash
   npm run db:push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   ```
   http://localhost:3000
   ```

## 📁 Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── api/            # API routes
│   ├── admin/          # Admin pages
│   ├── event/          # Event pages
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/         # React components
│   ├── ui/            # Reusable UI components
│   └── ...            # Feature components
├── hooks/             # Custom React hooks
├── lib/               # Utility libraries
├── shared/            # Shared schemas and types
└── styles/            # Global styles
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push database schema changes
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Drizzle Studio

## 📝 API Routes

### Events
- `POST /api/events` - Create new event
- `GET /api/events/[id]` - Get event by ID
- `POST /api/events/[eventId]/verify-code` - Verify event access code

### Photos
- `POST /api/events/[eventId]/photos` - Upload photo to event
- `GET /api/events/[eventId]/photos` - Get event photos
- `PATCH /api/photos/[photoId]/likes` - Update photo likes

### Messages
- `POST /api/events/[eventId]/messages` - Add message to event
- `GET /api/events/[eventId]/messages` - Get event messages
- `PATCH /api/messages/[messageId]/hearts` - Update message hearts

### Admin
- `GET /api/admin/events` - Get all events (admin)
- `DELETE /api/admin/events/[id]` - Delete event (admin)
- `GET /api/admin/stats` - Get platform statistics

## 🔒 Authentication & Security

- Event access menggunakan kode akses unik
- File upload dengan validasi dan sanitasi
- HTTPS enforcement di production
- Rate limiting untuk API endpoints

## 📱 Mobile-First Design

Aplikasi ini dirancang dengan pendekatan mobile-first untuk memastikan pengalaman optimal di semua perangkat, terutama smartphone yang digunakan tamu untuk upload foto.

## 🌐 Deployment

### Vercel (Recommended)

1. Push code ke GitHub
2. Connect repository di Vercel
3. Set environment variables di Vercel dashboard
4. Deploy!

### Manual Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## 📄 Migration Notes

Aplikasi ini telah dimigrasikan dari Vite/Express ke Next.js dengan perubahan berikut:

- ✅ Express API routes → Next.js API routes
- ✅ Wouter routing → Next.js App Router  
- ✅ Vite bundling → Next.js built-in bundling
- ✅ Express file upload → Next.js FormData handling
- ✅ Client-side routing → Server and client components
- ✅ Manual server setup → Next.js automatic server

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

Untuk pertanyaan atau dukungan, hubungi:
- Email: info@hafiportrait.com
- WhatsApp: +62 812-3456-7890

## 📄 License

This project is licensed under the MIT License. 