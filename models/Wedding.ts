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
  themeConfig: {
    primaryColor: string
    secondaryColor: string
    fontFamily: string
    headerStyle: string
    backgroundImage?: string
  }
  story: string
  slug: string
  isPrivate: boolean
  password?: string
  hasCustomDomain: boolean
  customDomain?: string
  events: Array<{
    title: string
    date: Date
    time: string
    venue: string
    description: string
  }>
  gallery: string[]
  galleryLayout: string
  galleryConfig: {
    spacing: number
    showCaptions: boolean
    borderRadius: number
    effect: string
  }
  createdAt: Date
  updatedAt: Date
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
    themeConfig: {
      primaryColor: { type: String, default: "#000000" },
      secondaryColor: { type: String, default: "#ffffff" },
      fontFamily: { type: String, default: "Inter" },
      headerStyle: { type: String, default: "centered" },
      backgroundImage: { type: String }
    },
    story: { type: String },
    slug: { type: String, required: true, unique: true },
    isPrivate: { type: Boolean, default: false },
    password: { type: String },
    hasCustomDomain: { type: Boolean, default: false },
    customDomain: { type: String },
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
    galleryLayout: { type: String, default: "grid" },
    galleryConfig: {
      spacing: { type: Number, default: 8 },
      showCaptions: { type: Boolean, default: false },
      borderRadius: { type: Number, default: 8 },
      effect: { type: String, default: "zoom" }
    }
  },
  { timestamps: true },
)

export default mongoose.models.Wedding || mongoose.model<IWedding>("Wedding", WeddingSchema)

