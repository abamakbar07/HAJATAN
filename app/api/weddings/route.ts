import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import dbConnect from "@/lib/mongodb"
import Wedding from "@/models/Wedding"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const userId = session.user.id
    const weddings = await Wedding.find({ userId })

    return NextResponse.json(weddings)
  } catch (error) {
    console.error("Error fetching weddings:", error)
    return NextResponse.json({ error: "Failed to fetch weddings" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const data = await req.json()
    const userId = session.user.id

    // Validate required fields
    const requiredFields = ['brideName', 'groomName', 'date', 'time', 'venue', 'address', 'city', 'country', 'slug'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json({ 
        error: `Missing required fields: ${missingFields.join(', ')}` 
      }, { status: 400 });
    }

    // Check if a wedding with this slug already exists
    const existingWedding = await Wedding.findOne({ slug: data.slug });
    if (existingWedding) {
      return NextResponse.json({ error: "A wedding with this URL already exists. Please try a different name." }, { status: 400 });
    }

    const wedding = new Wedding({
      ...data,
      userId,
    })

    await wedding.save()

    return NextResponse.json(wedding, { status: 201 })
  } catch (error: any) {
    console.error("Error creating wedding:", error)
    
    // Handle validation errors more specifically
    if (error.name === 'ValidationError') {
      const validationErrors = Object.keys(error.errors).map(field => 
        `${field}: ${error.errors[field].message}`
      );
      return NextResponse.json({ 
        error: `Validation failed: ${validationErrors.join(', ')}` 
      }, { status: 400 });
    }
    
    return NextResponse.json({ error: "Failed to create wedding" }, { status: 500 })
  }
}

