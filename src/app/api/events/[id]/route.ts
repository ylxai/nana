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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = params.id;
    const body = await request.json();
    
    const { name, date, access_code, is_premium } = body;
    
    if (!name || !date || !access_code) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const updatedEvent = await database.updateEvent(eventId, {
      name,
      date,
      access_code,
      is_premium: is_premium || false,
    });

    return NextResponse.json(updatedEvent);
  } catch (error: any) {
    console.error('Update event error:', error);
    return NextResponse.json(
      { message: "Failed to update event", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = params.id;
    
    // Delete the event (this will also delete associated photos and messages)
    await database.deleteEvent(eventId);
    
    return NextResponse.json({ message: "Event deleted successfully" });
  } catch (error: any) {
    console.error('Delete event error:', error);
    return NextResponse.json(
      { message: "Failed to delete event", error: error.message },
      { status: 500 }
    );
  }
} 