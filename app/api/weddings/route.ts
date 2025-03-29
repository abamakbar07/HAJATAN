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

    const wedding = new Wedding({
      ...data,
      userId,
    })

    await wedding.save()

    return NextResponse.json(wedding, { status: 201 })
  } catch (error) {
    console.error("Error creating wedding:", error)
    return NextResponse.json({ error: "Failed to create wedding" }, { status: 500 })
  }
}

