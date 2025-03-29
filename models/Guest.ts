import mongoose, { Schema, type Document } from "mongoose"

export interface IGuest extends Document {
  weddingId: mongoose.Types.ObjectId
  name: string
  email: string
  phone?: string
  group: string
  status: "pending" | "attending" | "not-attending"
  numberOfGuests: number
  message?: string
  qrCode?: string
  checkedIn: boolean
  checkedInAt?: Date
  createdAt: Date
  updatedAt: Date
}

const GuestSchema: Schema = new Schema(
  {
    weddingId: { type: Schema.Types.ObjectId, ref: "Wedding", required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    group: { type: String, default: "Friends" },
    status: {
      type: String,
      enum: ["pending", "attending", "not-attending"],
      default: "pending",
    },
    numberOfGuests: { type: Number, default: 1 },
    message: { type: String },
    qrCode: { type: String },
    checkedIn: { type: Boolean, default: false },
    checkedInAt: { type: Date },
  },
  { timestamps: true },
)

export default mongoose.models.Guest || mongoose.model<IGuest>("Guest", GuestSchema)

