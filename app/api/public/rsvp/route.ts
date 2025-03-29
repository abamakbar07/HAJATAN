import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Guest from "@/models/Guest"

export async function POST(req: NextRequest) {
  try {
    await dbConnect()

    const data = await req.json()
    const { email, weddingId } = data

    if (!email || !weddingId) {
      return NextResponse.json({ error: "Email and wedding ID are required" }, { status: 400 })
    }

    // Find the guest by email and wedding ID
    const guest = await Guest.findOne({
      email,
      weddingId,
    })

    if (!guest) {
      return NextResponse.json({ error: "Guest not found" }, { status: 404 })
    }

    // Update guest RSVP status
    guest.status = data.status || "pending"
    guest.numberOfGuests = data.numberOfGuests || 1
    guest.message = data.message || ""

    await guest.save()

    return NextResponse.json({
      message: "RSVP updated successfully",
      guest: {
        name: guest.name,
        status: guest.status,
        numberOfGuests: guest.numberOfGuests,
      },
    })
  } catch (error) {
    console.error("Error updating RSVP:", error)
    return NextResponse.json({ error: "Failed to update RSVP" }, { status: 500 })
  }
}

