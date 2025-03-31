import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Wedding from '@/models/Wedding';
import Guest from '@/models/Guest';
import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    
    if (!slug) {
      return NextResponse.json(
        { success: false, message: 'Wedding slug is required' },
        { status: 400 }
      );
    }
    
    await dbConnect();
    
    // Find the wedding by slug
    const wedding = await Wedding.findOne({ slug }).lean();
    
    if (!wedding) {
      return NextResponse.json(
        { success: false, message: 'Wedding not found' },
        { status: 404 }
      );
    }
    
    // Parse the request body
    const data = await req.json();
    const { name, email, phone, status, numberOfGuests, message } = data;
    
    // Validate required fields
    if (!name || !email || !status) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Cast the wedding document to have proper _id typing
    const weddingId = wedding._id.toString();
    
    // Check if guest already exists
    const existingGuest = await Guest.findOne({
      weddingId,
      email: email.toLowerCase(),
    });
    
    if (existingGuest) {
      // Update existing guest
      existingGuest.name = name;
      existingGuest.phone = phone;
      existingGuest.status = status;
      existingGuest.numberOfGuests = numberOfGuests || 1;
      existingGuest.message = message;
      
      await existingGuest.save();
      
      return NextResponse.json({
        success: true,
        message: 'Your RSVP has been updated',
        guest: existingGuest,
      });
    }
    
    // Generate QR code
    const qrCode = `guest-${weddingId}-${uuidv4()}`;
    
    // Create new guest
    const newGuest = new Guest({
      weddingId,
      name,
      email: email.toLowerCase(),
      phone,
      status,
      numberOfGuests: numberOfGuests || 1,
      message,
      qrCode,
    });
    
    await newGuest.save();
    
    return NextResponse.json(
      {
        success: true,
        message: 'Your RSVP has been submitted',
        guest: newGuest,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error handling RSVP:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while processing your RSVP' },
      { status: 500 }
    );
  }
} 