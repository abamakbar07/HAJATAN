import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import dbConnect from "@/lib/mongodb"
import Transaction from "@/models/Transaction"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const userId = session.user.id
    const transaction = await Transaction.findOne({
      _id: params.id,
      userId,
    })

    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found or unauthorized" }, { status: 404 })
    }

    return NextResponse.json(transaction)
  } catch (error) {
    console.error("Error fetching transaction:", error)
    return NextResponse.json({ error: "Failed to fetch transaction" }, { status: 500 })
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

    const transaction = await Transaction.findOne({
      _id: params.id,
      userId,
    })

    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found or unauthorized" }, { status: 404 })
    }

    // Only allow updating specific fields
    const allowedFields = ["status", "description"]
    allowedFields.forEach((field) => {
      if (data[field] !== undefined) {
        transaction[field] = data[field]
      }
    })

    await transaction.save()

    return NextResponse.json(transaction)
  } catch (error) {
    console.error("Error updating transaction:", error)
    return NextResponse.json({ error: "Failed to update transaction" }, { status: 500 })
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

    const transaction = await Transaction.findOneAndDelete({
      _id: params.id,
      userId,
    })

    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found or unauthorized" }, { status: 404 })
    }

    return NextResponse.json({ message: "Transaction deleted successfully" })
  } catch (error) {
    console.error("Error deleting transaction:", error)
    return NextResponse.json({ error: "Failed to delete transaction" }, { status: 500 })
  }
} 