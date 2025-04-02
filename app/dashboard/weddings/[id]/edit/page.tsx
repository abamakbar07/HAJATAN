import { notFound } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import dbConnect from "@/lib/mongodb"
import Wedding from "@/models/Wedding"
import { WeddingForm } from "@/components/wedding-form"

interface EditWeddingPageProps {
  params: {
    id: string
  }
}

export default async function EditWeddingPage({ params }: EditWeddingPageProps) {
  const session = await getServerSession(authOptions)

  if (!session) {
    notFound()
  }

  await dbConnect()

  const wedding = await Wedding.findOne({
    // _id: params.id,
    slug: params.id,
    userId: session.user.id,
  })

  if (!wedding) {
    notFound()
  }

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-6">Edit Wedding</h1>
      <WeddingForm wedding={JSON.parse(JSON.stringify(wedding))} isEditing />
    </div>
  )
}

