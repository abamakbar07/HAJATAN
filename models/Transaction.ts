import mongoose, { Schema, type Document } from "mongoose"

export interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId
  weddingId?: mongoose.Types.ObjectId
  type: "subscription" | "one-time" | "refund"
  amount: number
  currency: string
  status: "pending" | "completed" | "failed" | "refunded"
  paymentMethod: string
  paymentId?: string
  description?: string
  createdAt: Date
  updatedAt: Date
}

const TransactionSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    weddingId: { type: Schema.Types.ObjectId, ref: "Wedding" },
    type: { type: String, enum: ["subscription", "one-time", "refund"], required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true, default: "USD" },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    paymentMethod: { type: String, required: true },
    paymentId: { type: String },
    description: { type: String },
  },
  { timestamps: true },
)

export default mongoose.models.Transaction || mongoose.model<ITransaction>("Transaction", TransactionSchema)
