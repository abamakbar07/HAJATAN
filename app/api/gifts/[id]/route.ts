import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import dbConnect from "@/lib/mongodb"
import Gift from "@/models/Gift"
import Wedding from "@/models/Wedding"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()

    const gift = await Gift.findById(params.id).populate("guestId", "name email")

    if (!gift) {
      return NextResponse.json({ error: "Gift not found" }, { status: 404 })
    }

    return NextResponse.json(gift)
  } catch (error) {
    console.error("Error fetching gift:", error)
    return NextResponse.json({ error: "Failed to fetch gift" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const data = await req.json()
    const userId = session.user.id

    const gift = await Gift.findById(params.id)

    if (!gift) {
      return NextResponse.json({ error: "Gift not found" }, { status: 404 })
    }

    // Verify the wedding belongs to the user
    const wedding = await Wedding.findOne({
      _id: gift.weddingId,
      userId,
    })

    if (!wedding) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    Object.assign(gift, data)
    await gift.save()

    return NextResponse.json(gift)
  } catch (error) {
    console.error("Error updating gift:", error)
    return NextResponse.json({ error: "Failed to update gift" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const userId = session.user.id

    const gift = await Gift.findById(params.id)

    if (!gift) {
      return NextResponse.json({ error: "Gift not found" }, { status: 404 })
    }

    // Verify the wedding belongs to the user
    const wedding = await Wedding.findOne({
      _id: gift.weddingId,
      userId,
    })

    if (!wedding) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await Gift.findByIdAndDelete(params.id)

    return NextResponse.json({ message: "Gift deleted successfully" })
  } catch (error) {
    console.error("Error deleting gift:", error)
    return NextResponse.json({ error: "Failed to delete gift" }, { status: 500 })
  }
}

