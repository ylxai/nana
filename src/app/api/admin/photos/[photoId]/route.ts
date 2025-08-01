import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/lib/database'; // Mengimpor database langsung
import { deleteFile } from '@/lib/supabase'; // Mengimpor deleteFile

export async function DELETE(
  request: NextRequest,
  { params }: { params: { photoId: string } }
) {
  try {
    const photoId = params.photoId;

    // Dapatkan detail foto dari database untuk mendapatkan 'filename' (path storage)
    const photo = await database.getPhotoById(photoId);
    if (!photo) {
      return NextResponse.json({ message: "Photo not found" }, { status: 404 });
    }

    // Hapus file dari Supabase Storage
    await deleteFile(photo.filename); // Menggunakan filename sebagai path di storage

    // Hapus entri dari database
    await database.deletePhoto(photoId);
    
    return NextResponse.json({ message: "Photo deleted successfully" });
  } catch (error: any) {
    console.error('Delete photo error:', error);
    return NextResponse.json(
      { message: "Failed to delete photo", error: error.message },
      { status: 500 }
    );
  }
} 