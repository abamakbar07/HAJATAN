import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import dbConnect from "@/lib/mongodb"
import Wedding from "@/models/Wedding"
import Guest from "@/models/Guest"
import Gift from "@/models/Gift"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    // Find user's wedding
    const wedding = await Wedding.findOne({ userId: session.user.id })

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
          recentResponses: [],
        }
      })
    }

    // Get wedding stats
    const guests = await Guest.find({ weddingId: wedding._id })
    const gifts = await Gift.find({ weddingId: wedding._id })
    
    const invitations = guests.length
    const invitationsSent = guests.filter(guest => guest.invitationSent).length
    const invitationsOpened = guests.filter(guest => guest.invitationOpened).length
    const rsvpResponses = guests.filter(guest => guest.rsvpStatus !== 'pending').length
    const confirmedGuests = guests.filter(guest => guest.rsvpStatus === 'attending').length
    
    // Calculate percentages
    const responseRate = invitations > 0 ? Math.round((rsvpResponses / invitations) * 100) : 0
    const attendingRate = rsvpResponses > 0 ? Math.round((confirmedGuests / rsvpResponses) * 100) : 0
    
    // Calculate total gifts amount
    const totalGifts = gifts.reduce((total, gift) => total + (gift.amount || 0), 0)
    
    // Get recent responses - last 10 ordered by response date
    const recentResponses = guests
      .filter(guest => guest.rsvpStatus !== 'pending')
      .sort((a, b) => {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      })
      .slice(0, 10)
      .map(guest => ({
        id: guest._id.toString(),
        name: guest.name,
        email: guest.email || "",
        status: guest.rsvpStatus,
        timestamp: guest.updatedAt
      }))

    return NextResponse.json({
      stats: {
        invitations,
        rsvpResponses,
        confirmedGuests,
        totalGifts,
        invitationsSent,
        invitationsOpened,
        responseRate,
        attendingRate,
        recentResponses,
      },
      weddingDate: wedding.date || null,
    })
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 })
  }
} 