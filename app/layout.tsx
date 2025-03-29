import type React from "react"
import { Inter } from "next/font/google"
import { SessionProvider } from "@/providers/session-provider"
import { Navbar } from "@/components/ui/navbar"
import { Toaster } from "sonner"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Hajatan - Digital Wedding Invitations",
  description: "Create beautiful, personalized wedding microsites with RSVP, gift registry, and QR code entry systems.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <Navbar />
          <main>{children}</main>
          <Toaster position="top-right" />
        </SessionProvider>
      </body>
    </html>
  )
}



import './globals.css'