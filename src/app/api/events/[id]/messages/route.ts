import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/lib/database';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = params.id;
    const body = await request.json();

    if (!body.guestName || !body.message) {
      return NextResponse.json(
        { message: "Guest name and message are required" },
        { status: 400 }
      );
    }

    const message = await database.createMessage({
      event_id: eventId,
      guest_name: body.guestName,
      message: body.message,
    });

    return NextResponse.json(message);
  } catch (error: any) {
    console.error('Create message error:', error);
    return NextResponse.json(
      { message: "Failed to create message", error: error.message },
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
    const messages = await database.getEventMessages(eventId);
    
    return NextResponse.json(messages);
  } catch (error: any) {
    console.error('Get messages error:', error);
    return NextResponse.json(
      { message: "Failed to fetch messages", error: error.message },
      { status: 400 }
    );
  }
}