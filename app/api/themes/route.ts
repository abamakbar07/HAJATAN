import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import dbConnect from "@/lib/mongodb"
import Theme from "@/models/Theme"
import Wedding from "@/models/Wedding"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const url = new URL(req.url)
    const weddingId = url.searchParams.get("weddingId")
    
    if (!weddingId) {
      return NextResponse.json({ error: "Wedding ID is required" }, { status: 400 })
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

    const themes = await Theme.find({ weddingId })

    return NextResponse.json(themes)
  } catch (error) {
    console.error("Error fetching themes:", error)
    return NextResponse.json({ error: "Failed to fetch themes" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const data = await req.json()
    const { weddingId } = data
    
    if (!weddingId) {
      return NextResponse.json({ error: "Wedding ID is required" }, { status: 400 })
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

    const theme = new Theme({
      ...data,
    })

    await theme.save()

    return NextResponse.json(theme, { status: 201 })
  } catch (error) {
    console.error("Error creating theme:", error)
    return NextResponse.json({ error: "Failed to create theme" }, { status: 500 })
  }
} 