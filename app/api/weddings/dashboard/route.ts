import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
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
    const wedding = await Wedding.findOne({ userId })

    if (!wedding) {
      return NextResponse.json({
        stats: {
          invitations: 0,
          rsvpResponses: 0,
          confirmedGuests: 0,
          totalGifts: 0,
          invitationsSent: 0,
          invitationsOpened: 0,
          responseRate: 0,
          attendingRate: 0,
          weddingId: "",
          weddingSlug: "",
          recentResponses: []
        },
        weddingDate: null
      })
    }

    // Construct stats object with actual data
    return NextResponse.json({
      stats: {
        invitations: wedding.invitations?.length || 0,
        rsvpResponses: wedding.rsvpResponses || 0,
        confirmedGuests: wedding.confirmedGuests || 0,
        totalGifts: wedding.gifts?.length || 0,
        invitationsSent: wedding.invitationsSent || 0,
        invitationsOpened: wedding.invitationsOpened || 0,
        responseRate: wedding.responseRate || 0,
        attendingRate: wedding.attendingRate || 0,
        weddingId: wedding._id,
        weddingSlug: wedding.slug,
        recentResponses: wedding.recentResponses || []
      },
      weddingDate: wedding.date
    })
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 })
  }
}