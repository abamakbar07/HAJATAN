import Link from "next/link"
import {
  Calendar,
  ChevronDown,
  Gift,
  Heart,
  Mail,
  Menu,
  MessageSquare,
  PieChart,
  Plus,
  QrCode,
  Settings,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
        <Link className="flex items-center gap-2 font-semibold" href="/">
          <Heart className="h-6 w-6 text-rose-500" />
          <span className="hidden md:inline">Hajatan</span>
        </Link>
        <div className="w-full flex-1">
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link className="font-medium" href="/dashboard">
              Dashboard
            </Link>
            <Link className="text-muted-foreground hover:text-foreground" href="/dashboard/guests">
              Guests
            </Link>
            <Link className="text-muted-foreground hover:text-foreground" href="/dashboard/rsvp">
              RSVP
            </Link>
            <Link className="text-muted-foreground hover:text-foreground" href="/dashboard/gifts">
              Gifts
            </Link>
            <Link className="text-muted-foreground hover:text-foreground" href="/dashboard/settings">
              Settings
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          <Button variant="outline" size="sm" className="hidden md:flex">
            <PieChart className="mr-2 h-4 w-4" />
            View Analytics
          </Button>
          <Button size="sm" className="hidden md:flex bg-rose-500 hover:bg-rose-600">
            <Plus className="mr-2 h-4 w-4" />
            New Invitation
          </Button>
        </div>
      </header>
      <main className="flex-1 space-y-4 p-4 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Calendar className="mr-2 h-4 w-4" />
              June 15, 2025
            </Button>
            <Button variant="outline" size="sm" className="hidden md:flex">
              <Settings className="h-4 w-4" />
              <span className="sr-only">Settings</span>
            </Button>
          </div>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="guests">Guests</TabsTrigger>
            <TabsTrigger value="gifts">Gifts</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Invitations</CardTitle>
                  <Mail className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">250</div>
                  <p className="text-xs text-muted-foreground">+15% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">RSVP Responses</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">180</div>
                  <p className="text-xs text-muted-foreground">72% response rate</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Confirmed Guests</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">156</div>
                  <p className="text-xs text-muted-foreground">86% of responses</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Gifts</CardTitle>
                  <Gift className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Rp 12.5M</div>
                  <p className="text-xs text-muted-foreground">From 45 guests</p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="lg:col-span-4">
                <CardHeader>
                  <CardTitle>RSVP Overview</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <div className="h-[200px] w-full bg-muted/20 rounded-md flex items-center justify-center">
                    <p className="text-muted-foreground">RSVP Chart Placeholder</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Invitation Status</CardTitle>
                  <CardDescription>Track your invitation delivery and response rates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <div className="mr-2 h-3 w-3 rounded-full bg-rose-500" />
                          <span>Sent</span>
                        </div>
                        <span className="font-medium">250/250</span>
                      </div>
                      <Progress value={100} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <div className="mr-2 h-3 w-3 rounded-full bg-amber-500" />
                          <span>Opened</span>
                        </div>
                        <span className="font-medium">220/250</span>
                      </div>
                      <Progress value={88} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <div className="mr-2 h-3 w-3 rounded-full bg-green-500" />
                          <span>Responded</span>
                        </div>
                        <span className="font-medium">180/250</span>
                      </div>
                      <Progress value={72} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <div className="mr-2 h-3 w-3 rounded-full bg-blue-500" />
                          <span>Attending</span>
                        </div>
                        <span className="font-medium">156/180</span>
                      </div>
                      <Progress value={86} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Recent RSVP Responses</CardTitle>
                  <CardDescription>You have received 12 new responses in the last 24 hours</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-full bg-muted"></div>
                          <div>
                            <p className="text-sm font-medium">Guest Name {i + 1}</p>
                            <p className="text-xs text-muted-foreground">Responded {i + 1} hour ago</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              i % 3 === 0
                                ? "bg-green-100 text-green-800"
                                : i % 3 === 1
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {i % 3 === 0 ? "Attending" : i % 3 === 1 ? "Maybe" : "Not Attending"}
                          </span>
                          <Button variant="ghost" size="icon" className="ml-2">
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>QR Code Check-ins</CardTitle>
                  <CardDescription>Track guest arrivals on your wedding day</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-center p-4">
                    <QrCode className="h-24 w-24 text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Total Check-ins</span>
                      <span className="font-medium">0/156</span>
                    </div>
                    <Progress value={0} className="h-2" />
                  </div>
                  <div className="rounded-md bg-muted p-4">
                    <h4 className="mb-2 text-sm font-medium">Wedding Day Status</h4>
                    <p className="text-sm text-muted-foreground">
                      QR code check-in system will be active on your wedding day (June 15, 2025)
                    </p>
                    <Button className="mt-3 w-full bg-rose-500 hover:bg-rose-600" size="sm">
                      Test QR Scanner
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="guests" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Guest Management</CardTitle>
                <CardDescription>Manage your guest list and track RSVPs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        All Guests
                      </Button>
                      <Button variant="ghost" size="sm">
                        Attending
                      </Button>
                      <Button variant="ghost" size="sm">
                        Not Attending
                      </Button>
                      <Button variant="ghost" size="sm">
                        Pending
                      </Button>
                    </div>
                    <Button size="sm" className="bg-rose-500 hover:bg-rose-600">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Guest
                    </Button>
                  </div>
                  <div className="rounded-md border">
                    <div className="grid grid-cols-5 gap-4 p-4 font-medium border-b">
                      <div>Name</div>
                      <div>Email/Phone</div>
                      <div>Group</div>
                      <div>Status</div>
                      <div className="text-right">Actions</div>
                    </div>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="grid grid-cols-5 gap-4 p-4 border-b last:border-0 items-center">
                        <div className="font-medium">Guest Name {i + 1}</div>
                        <div className="text-sm text-muted-foreground">guest{i + 1}@example.com</div>
                        <div className="text-sm">Family</div>
                        <div>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              i % 3 === 0
                                ? "bg-green-100 text-green-800"
                                : i % 3 === 1
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {i % 3 === 0 ? "Attending" : i % 3 === 1 ? "Pending" : "Not Attending"}
                          </span>
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button variant="ghost" size="icon">
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                            >
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </Button>
                          <Button variant="ghost" size="icon">
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                            >
                              <path d="M20 6 9 17l-5-5" />
                            </svg>
                          </Button>
                          <Button variant="ghost" size="icon">
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                            >
                              <path d="M19 7l-.867 12.142A2 2 0 0 1 16.138 21H7.862a2 2 0 0 1-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v3M4 7h16" />
                            </svg>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="gifts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gift Registry & E-Angpao</CardTitle>
                <CardDescription>Track gifts and digital cash transfers from your guests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        All Gifts
                      </Button>
                      <Button variant="ghost" size="sm">
                        E-Angpao
                      </Button>
                      <Button variant="ghost" size="sm">
                        Physical Gifts
                      </Button>
                    </div>
                    <Button size="sm" className="bg-rose-500 hover:bg-rose-600">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Gift Item
                    </Button>
                  </div>
                  <div className="rounded-md border">
                    <div className="grid grid-cols-5 gap-4 p-4 font-medium border-b">
                      <div>From</div>
                      <div>Gift Type</div>
                      <div>Amount/Item</div>
                      <div>Date</div>
                      <div className="text-right">Status</div>
                    </div>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="grid grid-cols-5 gap-4 p-4 border-b last:border-0 items-center">
                        <div className="font-medium">Guest Name {i + 1}</div>
                        <div className="text-sm">{i % 2 === 0 ? "E-Angpao" : "Wishlist Item"}</div>
                        <div className="text-sm">{i % 2 === 0 ? `Rp ${(i + 1) * 500}.000` : `Gift Item ${i + 1}`}</div>
                        <div className="text-sm text-muted-foreground">June {i + 1}, 2025</div>
                        <div className="text-right">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              i % 3 === 0
                                ? "bg-green-100 text-green-800"
                                : i % 3 === 1
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {i % 3 === 0 ? "Received" : i % 3 === 1 ? "Thanked" : "Pending"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Wedding Details</CardTitle>
                <CardDescription>Update your wedding information and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="bride-name" className="text-sm font-medium">
                        Bride's Name
                      </label>
                      <input
                        id="bride-name"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        defaultValue="Putri Sari"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="groom-name" className="text-sm font-medium">
                        Groom's Name
                      </label>
                      <input
                        id="groom-name"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        defaultValue="Budi Santoso"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="wedding-date" className="text-sm font-medium">
                        Wedding Date
                      </label>
                      <input
                        id="wedding-date"
                        type="date"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        defaultValue="2025-06-15"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="wedding-time" className="text-sm font-medium">
                        Wedding Time
                      </label>
                      <input
                        id="wedding-time"
                        type="time"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        defaultValue="15:00"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="venue" className="text-sm font-medium">
                        Venue
                      </label>
                      <input
                        id="venue"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        defaultValue="Grand Ballroom, Hotel Indonesia Kempinski Jakarta"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="theme" className="text-sm font-medium">
                        Theme
                      </label>
                      <select
                        id="theme"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        defaultValue="modern"
                      >
                        <option value="modern">Modern</option>
                        <option value="traditional">Traditional</option>
                        <option value="islamic">Islamic</option>
                        <option value="custom">Custom</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="story" className="text-sm font-medium">
                      Your Love Story
                    </label>
                    <textarea
                      id="story"
                      className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      defaultValue="We first crossed paths at a coffee shop in Jakarta in 2020. What started as a casual conversation about our favorite books turned into hours of talking and laughing. Five years later, here we are, ready to begin our forever journey together."
                    ></textarea>
                  </div>
                  <Button className="bg-rose-500 hover:bg-rose-600">Save Changes</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

