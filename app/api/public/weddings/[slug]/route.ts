import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Wedding from "@/models/Wedding"
import bcrypt from "bcryptjs"

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    await dbConnect()

    const wedding = await Wedding.findOne({ slug: params.slug })

    if (!wedding) {
      return NextResponse.json({ error: "Wedding not found" }, { status: 404 })
    }

    // Public wedding or requires password
    if (!wedding.isPrivate) {
      return NextResponse.json({
        wedding: {
          id: wedding._id,
          brideName: wedding.brideName,
          groomName: wedding.groomName,
          date: wedding.date,
          time: wedding.time,
          venue: wedding.venue,
          address: wedding.address,
          city: wedding.city,
          country: wedding.country,
          theme: wedding.theme,
          story: wedding.story,
          events: wedding.events,
          gallery: wedding.gallery,
          isPrivate: false,
        },
        requiresPassword: false,
      })
    } else {
      // Private wedding
      return NextResponse.json({
        wedding: {
          id: wedding._id,
          brideName: wedding.brideName,
          groomName: wedding.groomName,
          isPrivate: true,
        },
        requiresPassword: true,
      })
    }
  } catch (error) {
    console.error("Error fetching wedding:", error)
    return NextResponse.json({ error: "Failed to fetch wedding" }, { status: 500 })
  }
}

export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    await dbConnect()

    const wedding = await Wedding.findOne({ slug: params.slug })

    if (!wedding) {
      return NextResponse.json({ error: "Wedding not found" }, { status: 404 })
    }

    // Not private, no password needed
    if (!wedding.isPrivate) {
      return NextResponse.json({
        wedding: {
          id: wedding._id,
          brideName: wedding.brideName,
          groomName: wedding.groomName,
          date: wedding.date,
          time: wedding.time,
          venue: wedding.venue,
          address: wedding.address,
          city: wedding.city,
          country: wedding.country,
          theme: wedding.theme,
          story: wedding.story,
          events: wedding.events,
          gallery: wedding.gallery,
        },
        success: true,
      })
    }

    // Check password for private wedding
    const { password } = await req.json()

    if (!password) {
      return NextResponse.json({ error: "Password is required" }, { status: 400 })
    }

    // For simplicity in this demo, assuming password is stored in plain text
    // In production, use proper hashing with bcrypt
    const passwordMatch = wedding.password === password
    // If your password is hashed:
    // const passwordMatch = await bcrypt.compare(password, wedding.password)

    if (!passwordMatch) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 })
    }

    return NextResponse.json({
      wedding: {
        id: wedding._id,
        brideName: wedding.brideName,
        groomName: wedding.groomName,
        date: wedding.date,
        time: wedding.time,
        venue: wedding.venue,
        address: wedding.address,
        city: wedding.city,
        country: wedding.country,
        theme: wedding.theme,
        story: wedding.story,
        events: wedding.events,
        gallery: wedding.gallery,
      },
      success: true,
    })
  } catch (error) {
    console.error("Error verifying wedding password:", error)
    return NextResponse.json({ error: "Failed to verify password" }, { status: 500 })
  }
} 