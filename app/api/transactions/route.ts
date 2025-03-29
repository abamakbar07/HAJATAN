import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import dbConnect from "@/lib/mongodb"
import Transaction from "@/models/Transaction"
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
    const userId = session.user.id

    const query = weddingId 
      ? { userId, weddingId }
      : { userId }

    const transactions = await Transaction.find(query).sort({ createdAt: -1 })

    return NextResponse.json(transactions)
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 })
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
    const userId = session.user.id

    // If weddingId is provided, verify it belongs to the user
    if (weddingId) {
      const wedding = await Wedding.findOne({
        _id: weddingId,
        userId,
      })

      if (!wedding) {
        return NextResponse.json({ error: "Wedding not found or unauthorized" }, { status: 404 })
      }
    }

    const transaction = new Transaction({
      ...data,
      userId,
    })

    await transaction.save()

    return NextResponse.json(transaction, { status: 201 })
  } catch (error) {
    console.error("Error creating transaction:", error)
    return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 })
  }
} 