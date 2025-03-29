import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import dbConnect from "@/lib/mongodb"
import Gift from "@/models/Gift"
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

    const gifts = await Gift.find({ weddingId }).populate("guestId", "name email")

    return NextResponse.json(gifts)
  } catch (error) {
    console.error("Error fetching gifts:", error)
    return NextResponse.json({ error: "Failed to fetch gifts" }, { status: 500 })
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

    const gift = new Gift(data)
    await gift.save()

    return NextResponse.json(gift, { status: 201 })
  } catch (error) {
    console.error("Error creating gift:", error)
    return NextResponse.json({ error: "Failed to create gift" }, { status: 500 })
  }
}

