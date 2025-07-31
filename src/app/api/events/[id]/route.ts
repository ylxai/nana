import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/lib/database';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const event = await database.getEventById(params.id);
    if (!event) {
      return NextResponse.json(
        { message: "Event not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(event);
  } catch (error: any) {
    console.error('Get event error:', error);
    return NextResponse.json(
      { message: "Failed to get event", error: error.message },
      { status: 500 }
    );
  }
} 