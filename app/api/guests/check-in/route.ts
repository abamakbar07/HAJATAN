import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import Guest from '@/models/Guest';
import Wedding from '@/models/Wedding';

export async function POST(req: NextRequest) {
  try {
    // Get the authenticated user session
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Parse the request body
    const { qrCode } = await req.json();
    
    if (!qrCode) {
      return NextResponse.json(
        { success: false, message: 'QR code is required' },
        { status: 400 }
      );
    }
    
    // Connect to the database
    await dbConnect();
    
    // Find the guest with the provided QR code
    const guest = await Guest.findOne({ qrCode });
    
    if (!guest) {
      return NextResponse.json(
        { success: false, message: 'Guest not found' },
        { status: 404 }
      );
    }
    
    // Check if the guest belongs to the user's wedding
    const wedding = await Wedding.findById(guest.weddingId);
    
    if (!wedding) {
      return NextResponse.json(
        { success: false, message: 'Wedding not found' },
        { status: 404 }
      );
    }
    
    if (wedding.userId.toString() !== session.user.id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized access' },
        { status: 403 }
      );
    }
    
    // Check if the guest has already checked in
    if (guest.checkedIn) {
      return NextResponse.json({
        success: false,
        message: `${guest.name} has already checked in at ${guest.checkedInAt?.toLocaleTimeString()}`,
        guestName: guest.name,
      });
    }
    
    // Update the guest's check-in status
    guest.checkedIn = true;
    guest.checkedInAt = new Date();
    await guest.save();
    
    return NextResponse.json({
      success: true,
      message: `${guest.name} has successfully checked in`,
      guestName: guest.name,
    });
  } catch (error) {
    console.error('Error checking in guest:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while checking in the guest' },
      { status: 500 }
    );
  }
} 