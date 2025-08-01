import { supabaseAdmin } from './supabase'; // Pastikan ini diimpor dengan benar

// Definisi Tipe Data untuk konsistensi
export type Event = {
  id: string;
  name: string;
  date: string;
  access_code: string | null;
  is_premium: boolean;
  qr_code: string | null;
  shareable_link: string | null;
};

export type Photo = {
  id: string;
  event_id?: string | null; // Opsional karena bisa jadi foto homepage
  url: string;
  thumbnail_url: string | null;
  uploaded_at: string;
  is_homepage: boolean | null; // Tambahkan ini jika belum ada
};

export type Message = {
  id: string;
  event_id: string;
  sender_name: string;
  content: string;
  sent_at: string;
  hearts: number;
};

export type Stats = {
  totalEvents: number;
  totalPhotos: number;
  totalMessages: number;
};

class DatabaseService {
  private supabase: typeof supabaseAdmin;

  constructor() {
    this.supabase = supabaseAdmin;
  }

  // --- Metode Event ---
  async getAllEvents(): Promise<Event[]> {
    const { data, error } = await this.supabase
      .from('events')
      .select('*')
      .order('date', { ascending: false });
    if (error) throw error;
    return data;
  }

  async getPublicEvents(): Promise<Event[]> {
    const { data, error } = await this.supabase
      .from('events')
      .select('id, name, date, is_premium, qr_code, shareable_link')
      .is('is_premium', false) // Asumsi hanya event non-premium yang publik, sesuaikan jika perlu
      .order('date', { ascending: false });
    if (error) throw error;
    return data;
  }

  async getEventById(id: string): Promise<Event | null> {
    const { data, error } = await this.supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  }

  async createEvent(event: Omit<Event, 'id' | 'qr_code' | 'shareable_link'>): Promise<Event> {
    const { data, error } = await this.supabase
      .from('events')
      .insert(event)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async updateEvent(id: string, updates: Partial<Event>): Promise<Event> {
    const { data, error } = await this.supabase
      .from('events')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async deleteEvent(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('events')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }

  async verifyEventAccessCode(eventId: string, code: string): Promise<boolean> {
    const { data, error } = await this.supabase
      .from('events')
      .select('id')
      .eq('id', eventId)
      .eq('access_code', code)
      .single();
    if (error) {
      console.error('Error verifying access code:', error);
      return false;
    }
    return !!data;
  }

  // --- Metode Foto ---
  async getEventPhotos(eventId: string): Promise<Photo[]> {
    const { data, error } = await this.supabase
      .from('photos')
      .select('*')
      .eq('event_id', eventId)
      .order('uploaded_at', { ascending: false });
    if (error) throw error;
    return data;
  }

  async getHomepagePhotos(): Promise<Photo[]> {
    const { data, error } = await this.supabase
      .from('photos')
      .select('*')
      .eq('is_homepage', true) // Asumsi kolom ini ada di tabel photos
      .order('uploaded_at', { ascending: false });
    if (error) {
      // Log error yang lebih spesifik jika kolom tidak ditemukan
      if (error.code === '42P01') { // PostgreSQL error code for undefined_table
        console.error("Database Error: Column 'is_homepage' does not exist. Please add it to your 'photos' table.");
      }
      throw error;
    }
    return data;
  }

  async uploadPhoto(eventId: string, file: File): Promise<Photo> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${eventId}/${fileName}`;

    const { data: uploadData, error: uploadError } = await this.supabase.storage
      .from('event_photos')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: publicUrlData } = this.supabase.storage
      .from('event_photos')
      .getPublicUrl(uploadData.path);

    const { data: photoData, error: insertError } = await this.supabase
      .from('photos')
      .insert({ event_id: eventId, url: publicUrlData.publicUrl, thumbnail_url: publicUrlData.publicUrl }) // Menggunakan url yang sama untuk thumbnail
      .select()
      .single();

    if (insertError) throw insertError;
    return photoData;
  }

  async uploadHomepagePhoto(file: File): Promise<Photo> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `homepage/${fileName}`;

    const { data: uploadData, error: uploadError } = await this.supabase.storage
      .from('homepage_photos') // Pastikan bucket ini ada di Supabase Anda
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: publicUrlData } = this.supabase.storage
      .from('homepage_photos')
      .getPublicUrl(uploadData.path);

    const { data: photoData, error: insertError } = await this.supabase
      .from('photos')
      .insert({ url: publicUrlData.publicUrl, thumbnail_url: publicUrlData.publicUrl, is_homepage: true })
      .select()
      .single();

    if (insertError) throw insertError;
    return photoData;
  }


  async deletePhoto(photoId: string): Promise<void> {
    const { data, error: fetchError } = await this.supabase
      .from('photos')
      .select('url, event_id')
      .eq('id', photoId)
      .single();

    if (fetchError) throw fetchError;
    if (!data) throw new Error('Photo not found');

    const filePath = data.url.split('/').pop(); // Asumsi path terakhir adalah nama file
    const bucketName = data.event_id ? 'event_photos' : 'homepage_photos'; // Tentukan bucket

    const { error: deleteStorageError } = await this.supabase.storage
      .from(bucketName)
      .remove([`${data.event_id || 'homepage'}/${filePath}`]); // Path lengkap di bucket

    if (deleteStorageError) console.error('Error deleting file from storage:', deleteStorageError);

    const { error: deleteDbError } = await this.supabase
      .from('photos')
      .delete()
      .eq('id', photoId);

    if (deleteDbError) throw deleteDbError;
  }

  async likePhoto(photoId: string): Promise<void> {
    const { data, error } = await this.supabase.rpc('increment_likes', { photo_id: photoId }); // Panggil fungsi RPC
    if (error) throw error;
  }


  // --- Metode Pesan ---
  async getEventMessages(eventId: string): Promise<Message[]> {
    const { data, error } = await this.supabase
      .from('messages')
      .select('*')
      .eq('event_id', eventId)
      .order('sent_at', { ascending: false });
    if (error) throw error;
    return data;
  }

  async createMessage(message: Omit<Message, 'id' | 'sent_at' | 'hearts'>): Promise<Message> {
    const { data, error } = await this.supabase
      .from('messages')
      .insert(message)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async heartMessage(messageId: string): Promise<void> {
    const { data, error } = await this.supabase.rpc('increment_hearts', { message_id: messageId }); // Panggil fungsi RPC
    if (error) throw error;
  }

  // --- Metode Statistik ---
  async getStats(): Promise<Stats> {
    const { count: totalEvents, error: eventsError } = await this.supabase
      .from('events')
      .select('*', { count: 'exact', head: true });
    if (eventsError) throw eventsError;

    const { count: totalPhotos, error: photosError } = await this.supabase
      .from('photos')
      .select('*', { count: 'exact', head: true });
    if (photosError) throw photosError;

    const { count: totalMessages, error: messagesError } = await this.supabase
      .from('messages')
      .select('*', { count: 'exact', head: true });
    if (messagesError) throw messagesError;

    return {
      totalEvents: totalEvents || 0,
      totalPhotos: totalPhotos || 0,
      totalMessages: totalMessages || 0,
    };
  }
}

export const database = new DatabaseService(); 