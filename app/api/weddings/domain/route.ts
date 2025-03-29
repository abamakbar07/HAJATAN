import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import dbConnect from "@/lib/mongodb"
import Wedding from "@/models/Wedding"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const data = await req.json()
    const { weddingId, customDomain } = data

    if (!weddingId || !customDomain) {
      return NextResponse.json({ error: "Wedding ID and custom domain are required" }, { status: 400 })
    }

    // Validate domain format
    const domainRegex = /^([a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/
    if (!domainRegex.test(customDomain)) {
      return NextResponse.json({ error: "Invalid domain format" }, { status: 400 })
    }

    const userId = session.user.id

    // Check if the domain is already in use
    const existingWedding = await Wedding.findOne({ customDomain })
    if (existingWedding && existingWedding._id.toString() !== weddingId) {
      return NextResponse.json({ error: "This domain is already in use" }, { status: 400 })
    }

    // Verify the wedding belongs to the user
    const wedding = await Wedding.findOne({
      _id: weddingId,
      userId,
    })

    if (!wedding) {
      return NextResponse.json({ error: "Wedding not found or unauthorized" }, { status: 404 })
    }

    // Update the wedding with the custom domain
    wedding.hasCustomDomain = true
    wedding.customDomain = customDomain
    await wedding.save()

    // In a real application, you would also set up DNS and SSL here
    // This would typically involve:
    // 1. API calls to your DNS provider
    // 2. Setting up SSL certificates
    // 3. Configuring your web server

    return NextResponse.json({
      message: "Custom domain configured successfully",
      wedding: {
        id: wedding._id,
        customDomain: wedding.customDomain,
        hasCustomDomain: wedding.hasCustomDomain,
      },
    })
  } catch (error) {
    console.error("Error configuring custom domain:", error)
    return NextResponse.json({ error: "Failed to configure custom domain" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
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

    // Remove custom domain
    wedding.hasCustomDomain = false
    wedding.customDomain = ""
    await wedding.save()

    // In a real application, you would also clean up DNS and SSL here

    return NextResponse.json({
      message: "Custom domain removed successfully",
    })
  } catch (error) {
    console.error("Error removing custom domain:", error)
    return NextResponse.json({ error: "Failed to remove custom domain" }, { status: 500 })
  }
} 