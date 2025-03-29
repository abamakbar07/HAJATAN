import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import Guest from '@/models/Guest';
import Wedding from '@/models/Wedding';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';

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
    const { guestIds, weddingId } = await req.json();
    
    if (!guestIds || !Array.isArray(guestIds) || guestIds.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Guest IDs are required' },
        { status: 400 }
      );
    }
    
    if (!weddingId) {
      return NextResponse.json(
        { success: false, message: 'Wedding ID is required' },
        { status: 400 }
      );
    }
    
    // Connect to the database
    await dbConnect();
    
    // Verify the wedding belongs to the user
    const wedding = await Wedding.findOne({
      _id: weddingId,
      userId: session.user.id,
    });
    
    if (!wedding) {
      return NextResponse.json(
        { success: false, message: 'Wedding not found or unauthorized' },
        { status: 404 }
      );
    }
    
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const results = [];
    
    // Process each guest
    for (const guestId of guestIds) {
      const guest = await Guest.findOne({
        _id: guestId,
        weddingId,
      });
      
      if (!guest) {
        results.push({
          id: guestId,
          success: false,
          message: 'Guest not found',
        });
        continue;
      }
      
      // Generate unique QR code if not exists
      if (!guest.qrCode) {
        const uniqueId = uuidv4();
        guest.qrCode = uniqueId;
        await guest.save();
      }
      
      // Generate QR code image
      const qrCodeData = `${baseUrl}/api/guests/check-in?code=${guest.qrCode}`;
      const qrCodeImage = await QRCode.toDataURL(qrCodeData);
      
      // Generate invitation link
      const invitationLink = `${baseUrl}/wedding/${wedding.slug}?guest=${guest._id}`;
      
      results.push({
        id: guest._id,
        name: guest.name,
        email: guest.email,
        phone: guest.phone,
        success: true,
        invitationLink,
        qrCodeImage,
      });
    }
    
    return NextResponse.json({
      success: true,
      results,
    });
  } catch (error) {
    console.error('Error generating invitations:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while generating invitations' },
      { status: 500 }
    );
  }
} 