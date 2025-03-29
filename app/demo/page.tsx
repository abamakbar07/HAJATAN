"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Calendar, Clock, Gift, Heart, MapPin, Share2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThemeSelector, themes, type ThemeOption } from "./theme-selector"

export default function WeddingMicrosite() {
  const [theme, setTheme] = useState<ThemeOption>(themes[0])
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  // Apply theme styles
  const themeStyles = {
    "--primary-color": theme.primaryColor,
    "--secondary-color": theme.secondaryColor,
    "--font-family": theme.fontFamily,
    "--bg-color": theme.bgColor,
  } as React.CSSProperties

  return (
    <div className="flex flex-col min-h-screen" style={{ ...themeStyles, backgroundColor: theme.bgColor }}>
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b px-4 py-3">
        <div className="container flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Heart className="h-5 w-5" style={{ color: theme.primaryColor }} />
            <span className="ml-2 font-medium">Hajatan</span>
          </Link>
          <nav className="hidden md:flex space-x-6">
            <Link
              href="#home"
              className="text-sm font-medium hover:text-foreground"
              style={{
                fontFamily: theme.fontFamily,
                color: "inherit",
                ":hover": { color: theme.primaryColor },
              }}
            >
              Home
            </Link>
            <Link
              href="#couple"
              className="text-sm font-medium hover:text-foreground"
              style={{
                fontFamily: theme.fontFamily,
                color: "inherit",
                ":hover": { color: theme.primaryColor },
              }}
            >
              Couple
            </Link>
            <Link
              href="#events"
              className="text-sm font-medium hover:text-foreground"
              style={{
                fontFamily: theme.fontFamily,
                color: "inherit",
                ":hover": { color: theme.primaryColor },
              }}
            >
              Events
            </Link>
            <Link
              href="#gallery"
              className="text-sm font-medium hover:text-foreground"
              style={{
                fontFamily: theme.fontFamily,
                color: "inherit",
                ":hover": { color: theme.primaryColor },
              }}
            >
              Gallery
            </Link>
            <Link
              href="#rsvp"
              className="text-sm font-medium hover:text-foreground"
              style={{
                fontFamily: theme.fontFamily,
                color: "inherit",
                ":hover": { color: theme.primaryColor },
              }}
            >
              RSVP
            </Link>
            <Link
              href="#gifts"
              className="text-sm font-medium hover:text-foreground"
              style={{
                fontFamily: theme.fontFamily,
                color: "inherit",
                ":hover": { color: theme.primaryColor },
              }}
            >
              Gifts
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeSelector currentTheme={theme} onThemeChange={setTheme} />
            <Button
              size="sm"
              style={{
                backgroundColor: theme.primaryColor,
                color: "white",
                ":hover": { backgroundColor: theme.primaryColor, opacity: 0.9 },
              }}
            >
              RSVP Now
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section
          id="home"
          className="relative h-screen flex items-center justify-center bg-cover bg-center"
          style={{ backgroundImage: "url('/placeholder.svg?height=1080&width=1920')" }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="relative z-10 text-center text-white space-y-6 px-4">
            <h1
              className="text-5xl md:text-7xl"
              style={{ fontFamily: theme.value === "modern" || theme.value === "minimalist" ? "sans-serif" : "serif" }}
            >
              Putri & Budi
            </h1>
            <p className="text-xl md:text-2xl" style={{ fontFamily: theme.fontFamily }}>
              are getting married
            </p>
            <div className="flex justify-center space-x-4">
              <div className="flex flex-col items-center">
                <Calendar className="h-6 w-6 mb-2" />
                <p className="text-lg font-medium" style={{ fontFamily: theme.fontFamily }}>
                  June 15, 2025
                </p>
              </div>
              <div className="flex flex-col items-center">
                <Clock className="h-6 w-6 mb-2" />
                <p className="text-lg font-medium" style={{ fontFamily: theme.fontFamily }}>
                  3:00 PM
                </p>
              </div>
              <div className="flex flex-col items-center">
                <MapPin className="h-6 w-6 mb-2" />
                <p className="text-lg font-medium" style={{ fontFamily: theme.fontFamily }}>
                  Jakarta, Indonesia
                </p>
              </div>
            </div>
            <div className="pt-6">
              <div className="text-xl font-medium mb-2" style={{ fontFamily: theme.fontFamily }}>
                Countdown to our special day
              </div>
              <div className="flex justify-center space-x-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 w-16">
                  <div className="text-2xl font-bold" style={{ fontFamily: theme.fontFamily }}>
                    120
                  </div>
                  <div className="text-xs" style={{ fontFamily: theme.fontFamily }}>
                    Days
                  </div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 w-16">
                  <div className="text-2xl font-bold" style={{ fontFamily: theme.fontFamily }}>
                    14
                  </div>
                  <div className="text-xs" style={{ fontFamily: theme.fontFamily }}>
                    Hours
                  </div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 w-16">
                  <div className="text-2xl font-bold" style={{ fontFamily: theme.fontFamily }}>
                    36
                  </div>
                  <div className="text-xs" style={{ fontFamily: theme.fontFamily }}>
                    Minutes
                  </div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 w-16">
                  <div className="text-2xl font-bold" style={{ fontFamily: theme.fontFamily }}>
                    52
                  </div>
                  <div className="text-xs" style={{ fontFamily: theme.fontFamily }}>
                    Seconds
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="couple" className="py-20 px-4" style={{ backgroundColor: theme.bgColor }}>
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2
                className="text-3xl md:text-4xl mb-4"
                style={{
                  fontFamily: theme.value === "modern" || theme.value === "minimalist" ? "sans-serif" : "serif",
                  color: theme.primaryColor,
                }}
              >
                Our Love Story
              </h2>
              <p className="text-muted-foreground" style={{ fontFamily: theme.fontFamily }}>
                The journey that brought us together
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div className="text-center space-y-4">
                <div
                  className="relative w-48 h-48 mx-auto rounded-full overflow-hidden border-4"
                  style={{ borderColor: theme.secondaryColor }}
                >
                  <img src="/placeholder.svg?height=200&width=200" alt="Bride" className="w-full h-full object-cover" />
                </div>
                <h3
                  className="text-2xl"
                  style={{
                    fontFamily: theme.value === "modern" || theme.value === "minimalist" ? "sans-serif" : "serif",
                    color: theme.primaryColor,
                  }}
                >
                  Putri Sari
                </h3>
                <p className="text-muted-foreground" style={{ fontFamily: theme.fontFamily }}>
                  Daughter of Mr. & Mrs. Sari
                </p>
                <p className="text-sm" style={{ fontFamily: theme.fontFamily }}>
                  Putri is a creative designer who loves to travel and explore new cultures. Her warm smile and kind
                  heart captivated Budi from the moment they met.
                </p>
              </div>
              <div className="text-center space-y-4">
                <div
                  className="relative w-48 h-48 mx-auto rounded-full overflow-hidden border-4"
                  style={{ borderColor: theme.secondaryColor }}
                >
                  <img src="/placeholder.svg?height=200&width=200" alt="Groom" className="w-full h-full object-cover" />
                </div>
                <h3
                  className="text-2xl"
                  style={{
                    fontFamily: theme.value === "modern" || theme.value === "minimalist" ? "sans-serif" : "serif",
                    color: theme.primaryColor,
                  }}
                >
                  Budi Santoso
                </h3>
                <p className="text-muted-foreground" style={{ fontFamily: theme.fontFamily }}>
                  Son of Mr. & Mrs. Santoso
                </p>
                <p className="text-sm" style={{ fontFamily: theme.fontFamily }}>
                  Budi is a software engineer with a passion for music and photography. His dedication and sense of
                  humor won Putri's heart during their first meeting at a mutual friend's gathering.
                </p>
              </div>
            </div>
            <div className="mt-16 text-center">
              <h3
                className="text-2xl mb-6"
                style={{
                  fontFamily: theme.value === "modern" || theme.value === "minimalist" ? "sans-serif" : "serif",
                  color: theme.primaryColor,
                }}
              >
                How We Met
              </h3>
              <p className="max-w-2xl mx-auto" style={{ fontFamily: theme.fontFamily }}>
                We first crossed paths at a coffee shop in Jakarta in 2020. What started as a casual conversation about
                our favorite books turned into hours of talking and laughing. Five years later, here we are, ready to
                begin our forever journey together. We believe that our meeting wasn't just coincidence, but destiny.
              </p>
            </div>
          </div>
        </section>

        <section id="events" className="py-20 px-4 bg-white">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2
                className="text-3xl md:text-4xl mb-4"
                style={{
                  fontFamily: theme.value === "modern" || theme.value === "minimalist" ? "sans-serif" : "serif",
                  color: theme.primaryColor,
                }}
              >
                Wedding Events
              </h2>
              <p className="text-muted-foreground" style={{ fontFamily: theme.fontFamily }}>
                Join us to celebrate our special day
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="overflow-hidden">
                <div className="h-48 overflow-hidden">
                  <img
                    src="/placeholder.svg?height=400&width=600"
                    alt="Akad Ceremony"
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <h3
                    className="text-2xl mb-2"
                    style={{
                      fontFamily: theme.value === "modern" || theme.value === "minimalist" ? "sans-serif" : "serif",
                      color: theme.primaryColor,
                    }}
                  >
                    Akad Ceremony
                  </h3>
                  <div className="space-y-3 text-sm" style={{ fontFamily: theme.fontFamily }}>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" style={{ color: theme.primaryColor }} />
                      <span>June 15, 2025</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" style={{ color: theme.primaryColor }} />
                      <span>10:00 AM - 12:00 PM</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" style={{ color: theme.primaryColor }} />
                      <span>Grand Ballroom, Hotel Indonesia Kempinski Jakarta</span>
                    </div>
                    <p className="pt-2">
                      The Akad ceremony will be an intimate gathering with close family members to witness our sacred
                      vows.
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="overflow-hidden">
                <div className="h-48 overflow-hidden">
                  <img
                    src="/placeholder.svg?height=400&width=600"
                    alt="Reception"
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <h3
                    className="text-2xl mb-2"
                    style={{
                      fontFamily: theme.value === "modern" || theme.value === "minimalist" ? "sans-serif" : "serif",
                      color: theme.primaryColor,
                    }}
                  >
                    Wedding Reception
                  </h3>
                  <div className="space-y-3 text-sm" style={{ fontFamily: theme.fontFamily }}>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" style={{ color: theme.primaryColor }} />
                      <span>June 15, 2025</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" style={{ color: theme.primaryColor }} />
                      <span>3:00 PM - 10:00 PM</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" style={{ color: theme.primaryColor }} />
                      <span>Grand Ballroom, Hotel Indonesia Kempinski Jakarta</span>
                    </div>
                    <p className="pt-2">
                      Join us for a celebration filled with love, laughter, delicious food, and dancing to commemorate
                      our union.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="gallery" className="py-20 px-4" style={{ backgroundColor: theme.bgColor }}>
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2
                className="text-3xl md:text-4xl mb-4"
                style={{
                  fontFamily: theme.value === "modern" || theme.value === "minimalist" ? "sans-serif" : "serif",
                  color: theme.primaryColor,
                }}
              >
                Our Gallery
              </h2>
              <p className="text-muted-foreground" style={{ fontFamily: theme.fontFamily }}>
                Moments we've shared together
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-square overflow-hidden rounded-lg">
                  <img
                    src={`/placeholder.svg?height=400&width=400&text=Photo ${i + 1}`}
                    alt={`Gallery image ${i + 1}`}
                    className="w-full h-full object-cover transition-transform hover:scale-110"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="rsvp" className="py-20 px-4 bg-white">
          <div className="container mx-auto max-w-2xl">
            <div className="text-center mb-12">
              <h2
                className="text-3xl md:text-4xl mb-4"
                style={{
                  fontFamily: theme.value === "modern" || theme.value === "minimalist" ? "sans-serif" : "serif",
                  color: theme.primaryColor,
                }}
              >
                RSVP
              </h2>
              <p className="text-muted-foreground" style={{ fontFamily: theme.fontFamily }}>
                Please let us know if you can celebrate with us
              </p>
            </div>
            <Card>
              <CardContent className="p-6">
                <form className="space-y-6">
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <label htmlFor="name" className="text-sm font-medium" style={{ fontFamily: theme.fontFamily }}>
                        Full Name
                      </label>
                      <input
                        id="name"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Enter your full name"
                        style={{ fontFamily: theme.fontFamily }}
                      />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="email" className="text-sm font-medium" style={{ fontFamily: theme.fontFamily }}>
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Enter your email"
                        style={{ fontFamily: theme.fontFamily }}
                      />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="phone" className="text-sm font-medium" style={{ fontFamily: theme.fontFamily }}>
                        Phone Number
                      </label>
                      <input
                        id="phone"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Enter your phone number"
                        style={{ fontFamily: theme.fontFamily }}
                      />
                    </div>
                    <div className="grid gap-2">
                      <label className="text-sm font-medium" style={{ fontFamily: theme.fontFamily }}>
                        Attendance
                      </label>
                      <div className="flex space-x-4" style={{ fontFamily: theme.fontFamily }}>
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="attendance"
                            className="h-4 w-4 border-gray-300 focus:ring-2"
                            style={{ accentColor: theme.primaryColor }}
                          />
                          <span>Yes, I will attend</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="attendance"
                            className="h-4 w-4 border-gray-300 focus:ring-2"
                            style={{ accentColor: theme.primaryColor }}
                          />
                          <span>No, I cannot attend</span>
                        </label>
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="guests" className="text-sm font-medium" style={{ fontFamily: theme.fontFamily }}>
                        Number of Guests
                      </label>
                      <select
                        id="guests"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        style={{ fontFamily: theme.fontFamily }}
                      >
                        <option value="1">1 person</option>
                        <option value="2">2 people</option>
                        <option value="3">3 people</option>
                        <option value="4">4 people</option>
                      </select>
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="message" className="text-sm font-medium" style={{ fontFamily: theme.fontFamily }}>
                        Message for the Couple (Optional)
                      </label>
                      <textarea
                        id="message"
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Write your wishes or message here"
                        style={{ fontFamily: theme.fontFamily }}
                      ></textarea>
                    </div>
                  </div>
                  <Button
                    className="w-full"
                    style={{
                      backgroundColor: theme.primaryColor,
                      color: "white",
                      fontFamily: theme.fontFamily,
                    }}
                  >
                    Submit RSVP
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>

        <section id="gifts" className="py-20 px-4" style={{ backgroundColor: theme.bgColor }}>
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2
                className="text-3xl md:text-4xl mb-4"
                style={{
                  fontFamily: theme.value === "modern" || theme.value === "minimalist" ? "sans-serif" : "serif",
                  color: theme.primaryColor,
                }}
              >
                Gifts & Registry
              </h2>
              <p className="text-muted-foreground" style={{ fontFamily: theme.fontFamily }}>
                Your presence is our present, but if you wish to give more...
              </p>
            </div>
            <Tabs defaultValue="digital" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="digital" style={{ fontFamily: theme.fontFamily }}>
                  Digital Angpao
                </TabsTrigger>
                <TabsTrigger value="wishlist" style={{ fontFamily: theme.fontFamily }}>
                  Wishlist
                </TabsTrigger>
              </TabsList>
              <TabsContent value="digital" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="mb-4">
                        <img
                          src="/placeholder.svg?height=100&width=200&text=BCA"
                          alt="BCA Bank"
                          className="h-12 mx-auto"
                        />
                      </div>
                      <h3
                        className="text-xl font-medium mb-2"
                        style={{
                          fontFamily: theme.fontFamily,
                          color: theme.primaryColor,
                        }}
                      >
                        Bank Transfer (BCA)
                      </h3>
                      <div className="bg-muted p-3 rounded-md mb-4">
                        <p className="font-mono text-lg">1234 5678 9012 3456</p>
                        <p className="text-sm text-muted-foreground" style={{ fontFamily: theme.fontFamily }}>
                          a/n Putri Sari
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {}}
                        style={{ fontFamily: theme.fontFamily }}
                      >
                        <svg
                          className="h-4 w-4 mr-2"
                          fill="none"
                          height="24"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          width="24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect height="14" rx="2" width="14" x="8" y="8" />
                          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h8" />
                        </svg>
                        Copy Account Number
                      </Button>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="mb-4">
                        <img
                          src="/placeholder.svg?height=100&width=200&text=GoPay"
                          alt="GoPay"
                          className="h-12 mx-auto"
                        />
                      </div>
                      <h3
                        className="text-xl font-medium mb-2"
                        style={{
                          fontFamily: theme.fontFamily,
                          color: theme.primaryColor,
                        }}
                      >
                        E-Wallet (GoPay)
                      </h3>
                      <div className="bg-muted p-3 rounded-md mb-4">
                        <p className="font-mono text-lg">0812 3456 7890</p>
                        <p className="text-sm text-muted-foreground" style={{ fontFamily: theme.fontFamily }}>
                          a/n Budi Santoso
                        </p>
                      </div>
                      <div className="mb-4">
                        <img
                          src="/placeholder.svg?height=200&width=200&text=QR+Code"
                          alt="QR Code"
                          className="h-40 w-40 mx-auto"
                        />
                      </div>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {}}
                        style={{ fontFamily: theme.fontFamily }}
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Share Payment Details
                      </Button>
                    </CardContent>
                  </Card>
                </div>
                <div className="text-center mt-6">
                  <p className="text-sm text-muted-foreground" style={{ fontFamily: theme.fontFamily }}>
                    All gifts will be acknowledged with a thank you message. Your generosity means the world to us!
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="wishlist" className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                      <div className="h-48 overflow-hidden">
                        <img
                          src={`/placeholder.svg?height=300&width=300&text=Gift+${i + 1}`}
                          alt={`Gift item ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h4 className="font-medium" style={{ fontFamily: theme.fontFamily }}>
                          Gift Item {i + 1}
                        </h4>
                        <p className="text-sm text-muted-foreground mb-2" style={{ fontFamily: theme.fontFamily }}>
                          Rp 500.000
                        </p>
                        <Button
                          size="sm"
                          className="w-full"
                          style={{
                            backgroundColor: theme.primaryColor,
                            color: "white",
                            fontFamily: theme.fontFamily,
                          }}
                        >
                          <Gift className="h-4 w-4 mr-2" />
                          Purchase Gift
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className="text-center mt-6">
                  <p className="text-sm text-muted-foreground" style={{ fontFamily: theme.fontFamily }}>
                    These items are from our wishlist. Feel free to purchase any of them or choose your own gift.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        <section className="py-20 px-4 bg-white">
          <div className="container mx-auto max-w-2xl text-center">
            <h2
              className="text-3xl md:text-4xl mb-6"
              style={{
                fontFamily: theme.value === "modern" || theme.value === "minimalist" ? "sans-serif" : "serif",
                color: theme.primaryColor,
              }}
            >
              Your QR Code Entry Pass
            </h2>
            <p className="text-muted-foreground mb-8" style={{ fontFamily: theme.fontFamily }}>
              Present this QR code at the venue entrance for quick and seamless check-in
            </p>
            <div className="bg-muted/30 border rounded-xl p-8 max-w-md mx-auto">
              <div className="mb-6">
                <img
                  src="/placeholder.svg?height=300&width=300&text=QR+Code"
                  alt="Entry QR Code"
                  className="h-64 w-64 mx-auto"
                />
              </div>
              <h3 className="text-xl font-medium" style={{ fontFamily: theme.fontFamily }}>
                Guest Name: John Doe
              </h3>
              <p className="text-muted-foreground mb-4" style={{ fontFamily: theme.fontFamily }}>
                Invitation #: INV-2025-001
              </p>
              <Separator className="my-4" />
              <div className="flex justify-center space-x-4">
                <Button variant="outline" size="sm" style={{ fontFamily: theme.fontFamily }}>
                  <svg
                    className="h-4 w-4 mr-2"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" x2="12" y1="15" y2="3" />
                  </svg>
                  Download
                </Button>
                <Button variant="outline" size="sm" style={{ fontFamily: theme.fontFamily }}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer
        style={{
          backgroundColor: theme.primaryColor,
          color: "white",
          fontFamily: theme.fontFamily,
        }}
        className="py-10 px-4"
      >
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8">
            <h2
              className="text-3xl mb-2"
              style={{
                fontFamily: theme.value === "modern" || theme.value === "minimalist" ? "sans-serif" : "serif",
              }}
            >
              Putri & Budi
            </h2>
            <p>We can't wait to celebrate with you!</p>
          </div>
          <div className="flex justify-center space-x-6 mb-8">
            <a href="#" className="hover:text-opacity-80">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
              </svg>
            </a>
            <a href="#" className="hover:text-opacity-80">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
              </svg>
            </a>
            <a href="#" className="hover:text-opacity-80">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
          </div>
          <div className="text-center text-sm opacity-80">
            <p>© 2025 Putri & Budi Wedding. All rights reserved.</p>
            <p className="mt-1">
              Powered by{" "}
              <a href="/" className="underline hover:text-white">
                Hajatan
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

