import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

export async function POST(request: NextRequest) {
  try {
    // Check authorization
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { publicId } = await request.json();
    
    if (!publicId) {
      return NextResponse.json({ error: 'Public ID is required' }, { status: 400 });
    }
    
    // Using Cloudinary REST API directly instead of the SDK
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    
    // Form the URL for the Cloudinary API
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/resources/image/upload/${publicId}`;
    
    const result = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')}`
      }
    });
    
    if (!result.ok) {
      return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}