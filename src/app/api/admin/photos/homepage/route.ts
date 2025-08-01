import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/lib/database';
import { uploadFile, generateFilePath } from '@/lib/supabase';

export async function GET() {
  try {
    const photos = await database.getHomepagePhotos();

    const publicPhotos = photos.map(photo => ({
      id: photo.id,
      url: photo.url,
      original_name: photo.original_name,
    }));

    return NextResponse.json(publicPhotos, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching homepage photos from API:', error);
    return NextResponse.json({ message: 'Gagal mengambil foto homepage', error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
    }

    // Perbaikan di sini: Pastikan memanggil database.uploadHomepagePhoto
    const photo = await database.uploadHomepagePhoto(file);
    return NextResponse.json(photo, { status: 201 });
  } catch (error: any) {
    console.error('Homepage photo upload error:', error);
    return NextResponse.json({ message: `Failed to upload photo: ${error.message}` }, { status: 500 });
  }
} 