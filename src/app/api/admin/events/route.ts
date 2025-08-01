import { NextResponse } from 'next/server';
import { database } from '@/lib/database';

export async function GET() {
  try {
    const events = await database.getAllEvents();
    return NextResponse.json(events);
  } catch (error: any) {
    console.error('Get admin events error:', error);
    return NextResponse.json({ message: 'Failed to load admin events' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const eventData = await request.json();
    const newEvent = await database.createEvent(eventData);
    return NextResponse.json(newEvent, { status: 201 });
  } catch (error: any) {
    console.error('Create event error:', error);
    return NextResponse.json({ message: `Failed to create event: ${error.message}` }, { status: 500 });
  }
}