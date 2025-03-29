import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import dbConnect from "@/lib/mongodb"
import Guest from "@/models/Guest"
import Wedding from "@/models/Wedding"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const url = new URL(req.url)
    const weddingId = url.searchParams.get("weddingId")

    if (!weddingId) {
      return NextResponse.json({ error: "Wedding ID is required" }, { status: 400 })
    }

    // Verify the wedding belongs to the user
    const userId = session.user.id
    const wedding = await Wedding.findOne({
      _id: weddingId,
      userId,
    })

    if (!wedding) {
      return NextResponse.json({ error: "Wedding not found or unauthorized" }, { status: 404 })
    }

    const guests = await Guest.find({ weddingId })

    return NextResponse.json(guests)
  } catch (error) {
    console.error("Error fetching guests:", error)
    return NextResponse.json({ error: "Failed to fetch guests" }, { status: 500 })
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
    const { weddingId } = data

    if (!weddingId) {
      return NextResponse.json({ error: "Wedding ID is required" }, { status: 400 })
    }

    // Verify the wedding belongs to the user
    const userId = session.user.id
    const wedding = await Wedding.findOne({
      _id: weddingId,
      userId,
    })

    if (!wedding) {
      return NextResponse.json({ error: "Wedding not found or unauthorized" }, { status: 404 })
    }

    // Generate QR code (in a real app, you'd use a library for this)
    const qrCode = `GUEST-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`

    const guest = new Guest({
      ...data,
      qrCode,
    })

    await guest.save()

    return NextResponse.json(guest, { status: 201 })
  } catch (error) {
    console.error("Error creating guest:", error)
    return NextResponse.json({ error: "Failed to create guest" }, { status: 500 })
  }
}

