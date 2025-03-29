import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import dbConnect from "@/lib/mongodb"
import Theme from "@/models/Theme"
import Wedding from "@/models/Wedding"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()

    const theme = await Theme.findById(params.id)

    if (!theme) {
      return NextResponse.json({ error: "Theme not found" }, { status: 404 })
    }

    return NextResponse.json(theme)
  } catch (error) {
    console.error("Error fetching theme:", error)
    return NextResponse.json({ error: "Failed to fetch theme" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const data = await req.json()
    const userId = session.user.id

    // Find the theme
    const theme = await Theme.findById(params.id)

    if (!theme) {
      return NextResponse.json({ error: "Theme not found" }, { status: 404 })
    }

    // Verify the wedding belongs to the user
    const wedding = await Wedding.findOne({
      _id: theme.weddingId,
      userId,
    })

    if (!wedding) {
      return NextResponse.json({ error: "Unauthorized to modify this theme" }, { status: 403 })
    }

    // Update theme
    const updateFields = [
      "name", "primaryColor", "secondaryColor", "fontFamily", 
      "headerStyle", "backgroundImage", "customCSS", "isPublic"
    ]
    
    updateFields.forEach(field => {
      if (data[field] !== undefined) {
        theme[field] = data[field]
      }
    })

    await theme.save()

    return NextResponse.json(theme)
  } catch (error) {
    console.error("Error updating theme:", error)
    return NextResponse.json({ error: "Failed to update theme" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const userId = session.user.id

    // Find the theme
    const theme = await Theme.findById(params.id)

    if (!theme) {
      return NextResponse.json({ error: "Theme not found" }, { status: 404 })
    }

    // Verify the wedding belongs to the user
    const wedding = await Wedding.findOne({
      _id: theme.weddingId,
      userId,
    })

    if (!wedding) {
      return NextResponse.json({ error: "Unauthorized to delete this theme" }, { status: 403 })
    }

    await Theme.findByIdAndDelete(params.id)

    return NextResponse.json({ message: "Theme deleted successfully" })
  } catch (error) {
    console.error("Error deleting theme:", error)
    return NextResponse.json({ error: "Failed to delete theme" }, { status: 500 })
  }
} 