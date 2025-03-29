import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import dbConnect from "@/lib/mongodb"
import Guest from "@/models/Guest"
import Wedding from "@/models/Wedding"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()

    const guest = await Guest.findById(params.id)

    if (!guest) {
      return NextResponse.json({ error: "Guest not found" }, { status: 404 })
    }

    return NextResponse.json(guest)
  } catch (error) {
    console.error("Error fetching guest:", error)
    return NextResponse.json({ error: "Failed to fetch guest" }, { status: 500 })
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

    const guest = await Guest.findById(params.id)

    if (!guest) {
      return NextResponse.json({ error: "Guest not found" }, { status: 404 })
    }

    // Verify the wedding belongs to the user
    const wedding = await Wedding.findOne({
      _id: guest.weddingId,
      userId,
    })

    if (!wedding) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    Object.assign(guest, data)
    await guest.save()

    return NextResponse.json(guest)
  } catch (error) {
    console.error("Error updating guest:", error)
    return NextResponse.json({ error: "Failed to update guest" }, { status: 500 })
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

    const guest = await Guest.findById(params.id)

    if (!guest) {
      return NextResponse.json({ error: "Guest not found" }, { status: 404 })
    }

    // Verify the wedding belongs to the user
    const wedding = await Wedding.findOne({
      _id: guest.weddingId,
      userId,
    })

    if (!wedding) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await Guest.findByIdAndDelete(params.id)

    return NextResponse.json({ message: "Guest deleted successfully" })
  } catch (error) {
    console.error("Error deleting guest:", error)
    return NextResponse.json({ error: "Failed to delete guest" }, { status: 500 })
  }
}

