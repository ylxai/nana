import { NextResponse } from 'next/server';
import { database } from '@/lib/database';

export async function GET() {
  try {
    const events = await database.getAllEvents();
    return NextResponse.json(events);
  } catch (error: any) {
    console.error('Get admin events error:', error);
    return NextResponse.json(
      { message: "Failed to fetch events", error: error.message },
      { status: 400 }
    );
  }
}