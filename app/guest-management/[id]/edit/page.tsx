import { notFound, redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import dbConnect from "@/lib/mongodb"
import Guest from "@/models/Guest"
import Wedding from "@/models/Wedding"
import { GuestForm } from "@/components/guest-form"

interface EditGuestPageProps {
  params: {
    id: string
  }
}

export default async function EditGuestPage({ params }: EditGuestPageProps) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  await dbConnect()

  const guest = await Guest.findById(params.id)

  if (!guest) {
    notFound()
  }

  // Verify the wedding belongs to the user
  const wedding = await Wedding.findOne({
    _id: guest.weddingId,
    userId: session.user.id,
  })

  if (!wedding) {
    notFound()
  }

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-6">Edit Guest</h1>
      <GuestForm weddingId={wedding._id.toString()} guest={JSON.parse(JSON.stringify(guest))} isEditing />
    </div>
  )
}

