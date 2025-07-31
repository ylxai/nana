import { supabaseAdmin } from './supabase';

// Database table types
export interface Event {
  id: string;
  name: string;
  date: string;
  qr_code: string;
  shareable_link: string;
  access_code: string;
  is_premium: boolean;
  created_at: string;
}

export interface Photo {
  id: string;
  event_id: string;
  filename: string;
  original_name: string;
  url: string;
  uploader_name: string | null;
  uploaded_at: string;
  album_name: string | null;
  likes: number | null;
}

export interface Message {
  id: string;
  event_id: string;
  guest_name: string;
  message: string;
  hearts: number | null;
  created_at: string;
}

export class DatabaseService {
  // ========== EVENTS ==========
  async createEvent(eventData: {
    name: string;
    date: string;
    access_code?: string;
    is_premium?: boolean;
  }): Promise<Event> {
    const eventId = crypto.randomUUID();
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    
    // Generate QR Code and share link
    const shareableLink = `${baseUrl}/event/${eventId}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareableLink)}`;
    
    const { data, error } = await supabaseAdmin
      .from('events')
      .insert({
        id: eventId,
        name: eventData.name,
        date: eventData.date,
        qr_code: qrCodeUrl,
        shareable_link: shareableLink,
        access_code: eventData.access_code || 'GUEST',
        is_premium: eventData.is_premium || false,
      })
      .select()
      .single();

    if (error) throw new Error(`Create event failed: ${error.message}`);
    return data;
  }

  async getEventById(id: string): Promise<Event | null> {
    const { data, error } = await supabaseAdmin
      .from('events')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Get event failed: ${error.message}`);
    }
    return data;
  }

  async getAllEvents(): Promise<Event[]> {
    const { data, error } = await supabaseAdmin
      .from('events')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Get events failed: ${error.message}`);
    return data || [];
  }

  async updateEvent(id: string, eventData: Partial<Event>): Promise<Event> {
    const { data, error } = await supabaseAdmin
      .from('events')
      .update(eventData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Update event failed: ${error.message}`);
    return data;
  }

  async deleteEvent(id: string): Promise<void> {
    // Delete associated photos first
    await supabaseAdmin.from('photos').delete().eq('event_id', id);
    
    // Delete associated messages
    await supabaseAdmin.from('messages').delete().eq('event_id', id);
    
    // Delete event
    const { error } = await supabaseAdmin.from('events').delete().eq('id', id);
    if (error) throw new Error(`Delete event failed: ${error.message}`);
  }

  // ========== PHOTOS ==========
  async createPhoto(photoData: {
    event_id: string;
    filename: string;
    original_name: string;
    url: string;
    uploader_name?: string;
    album_name?: string;
  }): Promise<Photo> {
    const { data, error } = await supabaseAdmin
      .from('photos')
      .insert({
        id: crypto.randomUUID(),
        event_id: photoData.event_id,
        filename: photoData.filename,
        original_name: photoData.original_name,
        url: photoData.url,
        uploader_name: photoData.uploader_name || null,
        album_name: photoData.album_name || 'Tamu',
        likes: 0,
      })
      .select()
      .single();

    if (error) throw new Error(`Create photo failed: ${error.message}`);
    return data;
  }

  async getEventPhotos(eventId: string): Promise<Photo[]> {
    const { data, error } = await supabaseAdmin
      .from('photos')
      .select('*')
      .eq('event_id', eventId)
      .order('uploaded_at', { ascending: false });

    if (error) throw new Error(`Get photos failed: ${error.message}`);
    return data || [];
  }

  async getHomepagePhotos(): Promise<Photo[]> {
    const { data, error } = await supabaseAdmin
      .from('photos')
      .select('*')
      .eq('event_id', 'homepage')
      .order('uploaded_at', { ascending: false });

    if (error) throw new Error(`Get homepage photos failed: ${error.message}`);
    return data || [];
  }

  async getPhotoById(id: string): Promise<Photo | null> {
    const { data, error } = await supabaseAdmin
      .from('photos')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Get photo failed: ${error.message}`);
    }
    return data;
  }

  async deletePhoto(id: string): Promise<void> {
    const { error } = await supabaseAdmin.from('photos').delete().eq('id', id);
    if (error) throw new Error(`Delete photo failed: ${error.message}`);
  }

  async getRecentPhotos(limit: number = 8): Promise<Photo[]> {
    const { data, error } = await supabaseAdmin
      .from('photos')
      .select('*')
      .order('uploaded_at', { ascending: false })
      .limit(limit);

    if (error) throw new Error(`Get recent photos failed: ${error.message}`);
    return data || [];
  }

  // ========== MESSAGES ==========
  async createMessage(messageData: {
    event_id: string;
    guest_name: string;
    message: string;
  }): Promise<Message> {
    const { data, error } = await supabaseAdmin
      .from('messages')
      .insert({
        id: crypto.randomUUID(),
        event_id: messageData.event_id,
        guest_name: messageData.guest_name,
        message: messageData.message,
        hearts: 0,
      })
      .select()
      .single();

    if (error) throw new Error(`Create message failed: ${error.message}`);
    return data;
  }

  async getEventMessages(eventId: string): Promise<Message[]> {
    const { data, error } = await supabaseAdmin
      .from('messages')
      .select('*')
      .eq('event_id', eventId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Get messages failed: ${error.message}`);
    return data || [];
  }

  async updateMessageHearts(id: string, hearts: number): Promise<void> {
    const { error } = await supabaseAdmin
      .from('messages')
      .update({ hearts })
      .eq('id', id);

    if (error) throw new Error(`Update message hearts failed: ${error.message}`);
  }

  // ========== STATS ==========
  async getStats(): Promise<{
    totalEvents: number;
    totalPhotos: number;
    totalMessages: number;
  }> {
    const [eventsResult, photosResult, messagesResult] = await Promise.all([
      supabaseAdmin.from('events').select('id', { count: 'exact', head: true }),
      supabaseAdmin.from('photos').select('id', { count: 'exact', head: true }),
      supabaseAdmin.from('messages').select('id', { count: 'exact', head: true }),
    ]);

    if (eventsResult.error) throw new Error(`Get events count failed: ${eventsResult.error.message}`);
    if (photosResult.error) throw new Error(`Get photos count failed: ${photosResult.error.message}`);
    if (messagesResult.error) throw new Error(`Get messages count failed: ${messagesResult.error.message}`);

    return {
      totalEvents: eventsResult.count || 0,
      totalPhotos: photosResult.count || 0,
      totalMessages: messagesResult.count || 0,
    };
  }
}

export const database = new DatabaseService(); 