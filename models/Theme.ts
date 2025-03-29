import mongoose, { Schema, type Document } from "mongoose"

export interface ITheme extends Document {
  weddingId: mongoose.Types.ObjectId
  name: string
  primaryColor: string
  secondaryColor: string
  fontFamily: string
  headerStyle: string
  backgroundImage?: string
  customCSS?: string
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
}

const ThemeSchema: Schema = new Schema(
  {
    weddingId: { type: Schema.Types.ObjectId, ref: "Wedding", required: true },
    name: { type: String, required: true },
    primaryColor: { type: String, required: true, default: "#000000" },
    secondaryColor: { type: String, required: true, default: "#ffffff" },
    fontFamily: { type: String, required: true, default: "Roboto" },
    headerStyle: { type: String, default: "centered" },
    backgroundImage: { type: String },
    customCSS: { type: String },
    isPublic: { type: Boolean, default: false },
  },
  { timestamps: true },
)

export default mongoose.models.Theme || mongoose.model<ITheme>("Theme", ThemeSchema)
