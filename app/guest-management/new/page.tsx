import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import dbConnect from "@/lib/mongodb"
import Wedding from "@/models/Wedding"
import { GuestForm } from "@/components/guest-form"

export default async function NewGuestPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  await dbConnect()

  // Get the first wedding for the user
  const wedding = await Wedding.findOne({
    userId: session.user.id,
  })

  if (!wedding) {
    redirect("/dashboard/weddings/new?message=Please create a wedding first")
  }

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-6">Add New Guest</h1>
      <GuestForm weddingId={wedding._id.toString()} />
    </div>
  )
}

