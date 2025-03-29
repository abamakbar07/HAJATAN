import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import dbConnect from "@/lib/mongodb"
import Guest from "@/models/Guest"
import Wedding from "@/models/Wedding"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const data = await req.json()
    const { qrCode, weddingId } = data

    if (!qrCode || !weddingId) {
      return NextResponse.json({ error: "QR code and wedding ID are required" }, { status: 400 })
    }

    const userId = session.user.id

    // Verify the wedding belongs to the user
    const wedding = await Wedding.findOne({
      _id: weddingId,
      userId,
    })

    if (!wedding) {
      return NextResponse.json({ error: "Wedding not found or unauthorized" }, { status: 404 })
    }

    // Find guest by QR code
    const guest = await Guest.findOne({
      qrCode,
      weddingId,
    })

    if (!guest) {
      return NextResponse.json({ error: "Guest not found" }, { status: 404 })
    }

    // Check in the guest
    guest.checkedIn = true
    guest.checkedInAt = new Date()
    await guest.save()

    return NextResponse.json({
      guest: {
        id: guest._id,
        name: guest.name,
        email: guest.email,
        group: guest.group,
        status: guest.status,
        numberOfGuests: guest.numberOfGuests,
        checkedIn: guest.checkedIn,
        checkedInAt: guest.checkedInAt,
      },
      message: "Guest checked in successfully",
    })
  } catch (error) {
    console.error("Error checking in guest:", error)
    return NextResponse.json({ error: "Failed to check in guest" }, { status: 500 })
  }
} 