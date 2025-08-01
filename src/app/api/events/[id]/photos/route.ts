import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/lib/database';
import { uploadFile, generateFilePath } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const eventId = params.id;

  if (!eventId) {
    return NextResponse.json({ error: "Event ID is required" }, { status: 400 });
  }

  try {
    const photos = await database.getEventPhotos(eventId);
    return NextResponse.json(photos);
  } catch (error: any) {
    console.error("Get photos error:", error);
    return NextResponse.json(
      { error: "Failed to fetch event photos", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const eventId = params.id;
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
    }

    // Perbaikan di sini: Menggunakan database.uploadPhoto
    const photo = await database.uploadPhoto(eventId, file);
    return NextResponse.json(photo, { status: 201 });
  } catch (error: any) {
    console.error('Error uploading event photo:', error);
    return NextResponse.json({ message: `Failed to upload photo: ${error.message}` }, { status: 500 });
  }
} 