import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/lib/database';
import { deleteFile } from '@/lib/supabase';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { photoId: string } }
) {
  try {
    const photoId = params.photoId;
    
    // Get photo details first
    const photo = await database.getPhotoById(photoId);
    
    if (!photo) {
      return NextResponse.json(
        { message: "Photo not found" },
        { status: 404 }
      );
    }

    // Extract file path from Supabase URL
    // URL format: https://xxx.supabase.co/storage/v1/object/public/bucket/path
    const urlParts = photo.url.split('/');
    const bucketIndex = urlParts.findIndex(part => part === 'public') + 1;
    if (bucketIndex > 0 && bucketIndex < urlParts.length) {
      // Skip bucket name, get the file path
      const filePath = urlParts.slice(bucketIndex + 1).join('/');
      
      // Delete file from Supabase Storage
      try {
        await deleteFile(filePath);
      } catch (storageError) {
        console.warn('Could not delete file from storage:', storageError);
        // Continue with database deletion even if storage deletion fails
      }
    }

    // Delete from database
    await database.deletePhoto(photoId);
    
    return NextResponse.json({ message: "Photo deleted successfully" });
  } catch (error: any) {
    console.error('Delete photo error:', error);
    return NextResponse.json(
      { message: "Failed to delete photo", error: error.message },
      { status: 400 }
    );
  }
} 