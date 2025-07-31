-- Supabase Database Setup for HafiPortrait
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Events Table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  date TEXT NOT NULL,
  qr_code TEXT NOT NULL,
  shareable_link TEXT NOT NULL,
  access_code TEXT NOT NULL DEFAULT 'GUEST',
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Photos Table  
CREATE TABLE IF NOT EXISTS photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id TEXT NOT NULL, -- Can be UUID or 'homepage'
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  url TEXT NOT NULL,
  uploader_name TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  album_name TEXT DEFAULT 'Tamu',
  likes INTEGER DEFAULT 0
);

-- Create Messages Table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  guest_name TEXT NOT NULL,
  message TEXT NOT NULL,
  hearts INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_photos_event_id ON photos(event_id);
CREATE INDEX IF NOT EXISTS idx_photos_album_name ON photos(album_name);
CREATE INDEX IF NOT EXISTS idx_photos_uploaded_at ON photos(uploaded_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_event_id ON messages(event_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON events(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
-- Note: Adjust these policies based on your security requirements

-- Events policies
CREATE POLICY "Events are viewable by everyone" ON events
  FOR SELECT USING (true);

CREATE POLICY "Events are manageable by service role" ON events
  FOR ALL USING (auth.role() = 'service_role');

-- Photos policies  
CREATE POLICY "Photos are viewable by everyone" ON photos
  FOR SELECT USING (true);

CREATE POLICY "Photos are manageable by service role" ON photos
  FOR ALL USING (auth.role() = 'service_role');

-- Messages policies
CREATE POLICY "Messages are viewable by everyone" ON messages
  FOR SELECT USING (true);

CREATE POLICY "Messages are manageable by service role" ON messages
  FOR ALL USING (auth.role() = 'service_role');

-- Insert some sample data (optional)
INSERT INTO events (id, name, date, qr_code, shareable_link, access_code, is_premium) VALUES
('123e4567-e89b-12d3-a456-426614174000', 'Sample Wedding Event', '2024-02-14', 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=http%3A%2F%2Flocalhost%3A3000%2Fevent%2F123e4567-e89b-12d3-a456-426614174000', 'http://localhost:3000/event/123e4567-e89b-12d3-a456-426614174000', 'LOVE2024', true)
ON CONFLICT (id) DO NOTHING; 