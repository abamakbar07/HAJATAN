import type React from "react"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { DashboardSidebar } from "@/components/DashboardSidebar"
import { Toaster } from "@/components/ui/toaster"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 space-y-4 p-4 md:p-8">
          {children}
        </main>
        <Toaster />
      </div>
    </div>
  )
}

