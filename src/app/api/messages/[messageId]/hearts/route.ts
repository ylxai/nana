import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/lib/database';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { messageId: string } }
) {
  try {
    const messageId = params.messageId;
    const body = await request.json();
    const { hearts } = body;

    if (typeof hearts !== 'number') {
      return NextResponse.json(
        { message: "Hearts must be a number" },
        { status: 400 }
      );
    }

    // Update message hearts
    await database.updateMessageHearts(messageId, hearts);

    return NextResponse.json({ 
      success: true, 
      message: "Hearts updated successfully" 
    });
  } catch (error: any) {
    console.error('Update message hearts error:', error);
    return NextResponse.json(
      { message: "Failed to update hearts", error: error.message },
      { status: 500 }
    );
  }
} 