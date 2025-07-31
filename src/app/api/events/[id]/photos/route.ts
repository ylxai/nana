import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/lib/database';
import { uploadFile, generateFilePath } from '@/lib/supabase';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = params.id;
    const formData = await request.formData();
    const photo = formData.get('photo') as File;
    const uploaderName = formData.get('uploaderName') as string;
    const albumName = formData.get('albumName') as string;

    if (!photo) {
      return NextResponse.json(
        { message: "No photo file provided" },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    if (photo.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { message: "File size too large. Maximum 10MB allowed." },
        { status: 400 }
      );
    }

    // Validate file type
    if (!photo.type.startsWith('image/')) {
      return NextResponse.json(
        { message: "Only image files are allowed" },
        { status: 400 }
      );
    }

    // Generate file path for Supabase Storage
    const filePath = generateFilePath('events', photo.name, eventId);
    
    // Upload to Supabase Storage
    const publicUrl = await uploadFile(photo, filePath);

    // Save photo metadata to database
    const savedPhoto = await database.createPhoto({
      event_id: eventId,
      filename: filePath.split('/').pop()!,
      original_name: photo.name,
      url: publicUrl,
      uploader_name: uploaderName || 'Anonim',
      album_name: albumName || 'Tamu',
    });

    return NextResponse.json(savedPhoto);
  } catch (error: any) {
    console.error('Photo upload error:', error);
    return NextResponse.json(
      { message: "Upload failed", error: error.message },
      { status: 400 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = params.id;
    const photos = await database.getEventPhotos(eventId);
    
    return NextResponse.json(photos);
  } catch (error: any) {
    console.error('Get photos error:', error);
    return NextResponse.json(
      { message: "Failed to fetch photos", error: error.message },
      { status: 400 }
    );
  }
} 