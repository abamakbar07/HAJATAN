import mongoose, { Schema, type Document } from "mongoose"

export interface IWedding extends Document {
  userId: mongoose.Types.ObjectId
  brideName: string
  groomName: string
  date: Date
  time: string
  venue: string
  address: string
  city: string
  country: string
  theme: string
  story: string
  events: Array<{
    title: string
    date: Date
    time: string
    venue: string
    description: string
  }>
  gallery: string[]
  createdAt: Date
  updatedAt: Date
  slug: string
  isPrivate: boolean
  password: string
  hasCustomDomain: boolean
  customDomain: string
}

const WeddingSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    brideName: { type: String, required: true },
    groomName: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    venue: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    theme: { type: String, default: "modern" },
    story: { type: String },
    events: [
      {
        title: { type: String, required: true },
        date: { type: Date, required: true },
        time: { type: String, required: true },
        venue: { type: String, required: true },
        description: { type: String },
      },
    ],
    gallery: [{ type: String }],
    slug: { type: String, required: true, unique: true },
    isPrivate: { type: Boolean, default: false },
    password: { type: String },
    hasCustomDomain: { type: Boolean, default: false },
    customDomain: { type: String },
  },
  { timestamps: true },
)

export default mongoose.models.Wedding || mongoose.model<IWedding>("Wedding", WeddingSchema)

