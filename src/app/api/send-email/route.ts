import { NextRequest, NextResponse } from 'next/server';
import { sendBookingConfirmation } from '@/lib/email';
import { Booking } from '@/lib/storage';

export async function POST(request: NextRequest) {
  try {
    const booking: Booking = await request.json();
    
    // Validate booking data
    if (!booking.email || !booking.name || !booking.date || !booking.time) {
      return NextResponse.json(
        { error: 'Missing required booking information' },
        { status: 400 }
      );
    }

    // Send confirmation email
    const result = await sendBookingConfirmation(booking);
    
    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Confirmation email sent successfully',
        demo: result.demo || false
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to send email', details: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Email API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

