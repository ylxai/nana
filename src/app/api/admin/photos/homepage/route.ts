import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/lib/database';
import { uploadFile, generateFilePath } from '@/lib/supabase';

export async function GET() {
  try {
    const photos = await database.getHomepagePhotos();
    return NextResponse.json(photos);
  } catch (error: any) {
    console.error('Get homepage photos error:', error);
    return NextResponse.json(
      { message: "Failed to fetch homepage photos", error: error.message },
      { status: 400 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const photo = formData.get('photo') as File;
    const albumName = formData.get('albumName') as string || 'homepage';

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
    const filePath = generateFilePath('homepage', photo.name);
    
    // Upload to Supabase Storage
    const publicUrl = await uploadFile(photo, filePath);

    // Save to database
    const savedPhoto = await database.createPhoto({
      event_id: 'homepage', // Special eventId for homepage photos
      filename: filePath.split('/').pop()!,
      original_name: photo.name,
      url: publicUrl,
      uploader_name: 'Admin',
      album_name: 'homepage',
    });

    return NextResponse.json(savedPhoto);
  } catch (error: any) {
    console.error('Homepage photo upload error:', error);
    return NextResponse.json(
      { message: "Upload failed", error: error.message },
      { status: 400 }
    );
  }
} 