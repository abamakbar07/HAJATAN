import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import dbConnect from "@/lib/mongodb"
import Wedding from "@/models/Wedding"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()

    const wedding = await Wedding.findById(params.id)

    if (!wedding) {
      return NextResponse.json({ error: "Wedding not found" }, { status: 404 })
    }

    return NextResponse.json(wedding)
  } catch (error) {
    console.error("Error fetching wedding:", error)
    return NextResponse.json({ error: "Failed to fetch wedding" }, { status: 500 })
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

    const wedding = await Wedding.findOne({
      _id: params.id,
      userId,
    })

    if (!wedding) {
      return NextResponse.json({ error: "Wedding not found or unauthorized" }, { status: 404 })
    }

    Object.assign(wedding, data)
    await wedding.save()

    return NextResponse.json(wedding)
  } catch (error) {
    console.error("Error updating wedding:", error)
    return NextResponse.json({ error: "Failed to update wedding" }, { status: 500 })
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

    const wedding = await Wedding.findOneAndDelete({
      _id: params.id,
      userId,
    })

    if (!wedding) {
      return NextResponse.json({ error: "Wedding not found or unauthorized" }, { status: 404 })
    }

    return NextResponse.json({ message: "Wedding deleted successfully" })
  } catch (error) {
    console.error("Error deleting wedding:", error)
    return NextResponse.json({ error: "Failed to delete wedding" }, { status: 500 })
  }
}

