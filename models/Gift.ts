import mongoose, { Schema, type Document } from "mongoose"

export interface IGift extends Document {
  weddingId: mongoose.Types.ObjectId
  guestId?: mongoose.Types.ObjectId
  type: "cash" | "item"
  name?: string
  amount?: number
  itemName?: string
  itemPrice?: number
  status: "pending" | "received" | "thanked"
  message?: string
  createdAt: Date
  updatedAt: Date
}

const GiftSchema: Schema = new Schema(
  {
    weddingId: { type: Schema.Types.ObjectId, ref: "Wedding", required: true },
    guestId: { type: Schema.Types.ObjectId, ref: "Guest" },
    type: { type: String, enum: ["cash", "item"], required: true },
    name: { type: String },
    amount: { type: Number },
    itemName: { type: String },
    itemPrice: { type: Number },
    status: {
      type: String,
      enum: ["pending", "received", "thanked"],
      default: "pending",
    },
    message: { type: String },
  },
  { timestamps: true },
)

export default mongoose.models.Gift || mongoose.model<IGift>("Gift", GiftSchema)

