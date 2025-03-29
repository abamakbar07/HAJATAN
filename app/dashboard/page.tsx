"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useAuth } from "@/providers/auth-provider"
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
import { toast } from "sonner"

interface DashboardStats {
  invitations: number;
  rsvpResponses: number;
  confirmedGuests: number;
  totalGifts: number;
  invitationsSent: number;
  invitationsOpened: number;
  responseRate: number;
  attendingRate: number;
  recentResponses: Array<{
    id: string;
    name: string;
    email: string;
    status: "attending" | "not-attending" | "pending";
    timestamp: string;
  }>;
}

export default function DashboardPage() {
  const { user, status } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    invitations: 0,
    rsvpResponses: 0,
    confirmedGuests: 0,
    totalGifts: 0,
    invitationsSent: 0,
    invitationsOpened: 0,
    responseRate: 0,
    attendingRate: 0,
    recentResponses: [],
  })
  const [loading, setLoading] = useState(true)
  const [weddingDate, setWeddingDate] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [noWedding, setNoWedding] = useState(false)

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (status !== "authenticated") return;
      
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch("/api/weddings/dashboard");
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch dashboard data");
        }
        
        const data = await response.json();
        
        setStats(data.stats);
        
        if (data.weddingDate) {
          setWeddingDate(new Date(data.weddingDate));
          setNoWedding(false);
        } else {
          setNoWedding(true);
        }
      } catch (err: any) {
        console.error("Error fetching dashboard data:", err);
        setError(err.message);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [status]);

  const formatDate = (date: Date | null) => {
    if (!date) return "Set Wedding Date";
    return date.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  };

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
          <h1 className="text-2xl font-bold tracking-tight">
            {loading ? "Loading..." : `Welcome back, ${user?.name?.split(" ")[0] || "User"}`}
          </h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Calendar className="mr-2 h-4 w-4" />
              {weddingDate ? formatDate(weddingDate) : "No wedding date set"}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="hidden md:flex"
              asChild
            >
              <Link href="/dashboard/settings">
                <Settings className="h-4 w-4" />
                <span className="sr-only">Settings</span>
              </Link>
            </Button>
          </div>
        </div>
        
        {error && (
          <Card className="bg-red-50 border-red-200">
            <CardContent className="pt-6">
              <p className="text-red-700">Error loading dashboard data: {error}</p>
            </CardContent>
          </Card>
        )}
        
        {loading && (
          <div className="w-full h-60 flex items-center justify-center">
            <p className="text-lg text-muted-foreground">Loading your dashboard...</p>
          </div>
        )}
        
        {!loading && noWedding && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center text-center space-y-4 py-8">
                <h2 className="text-xl font-semibold">You don't have any weddings yet</h2>
                <p className="text-muted-foreground">Create your first wedding invitation to get started</p>
                <Link href="/dashboard/weddings/new">
                  <Button className="bg-rose-500 hover:bg-rose-600">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Wedding Invitation
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
        
        {!loading && !noWedding && (
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
                    <div className="text-2xl font-bold">{stats.invitations}</div>
                    <p className="text-xs text-muted-foreground">Sent to your guests</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">RSVP Responses</CardTitle>
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.rsvpResponses}</div>
                    <p className="text-xs text-muted-foreground">
                      {stats.responseRate > 0 ? `${stats.responseRate}% response rate` : "No responses yet"}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Confirmed Guests</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.confirmedGuests}</div>
                    <p className="text-xs text-muted-foreground">
                      {stats.attendingRate > 0 ? `${stats.attendingRate}% of responses` : "No confirmations yet"}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Gifts</CardTitle>
                    <Gift className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {stats.totalGifts > 0 ? `Rp ${(stats.totalGifts / 1000000).toFixed(1)}M` : "No gifts yet"}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {stats.recentResponses.length > 0 ? `From ${stats.recentResponses.length} guests` : "Be patient"}
                    </p>
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
                      <p className="text-muted-foreground">RSVP Chart Coming Soon</p>
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
                          <span className="font-medium">
                            {stats.invitationsSent}/{stats.invitations}
                          </span>
                        </div>
                        <Progress value={stats.invitations > 0 ? (stats.invitationsSent / stats.invitations) * 100 : 0} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center">
                            <div className="mr-2 h-3 w-3 rounded-full bg-amber-500" />
                            <span>Opened</span>
                          </div>
                          <span className="font-medium">
                            {stats.invitationsOpened}/{stats.invitations}
                          </span>
                        </div>
                        <Progress value={stats.invitations > 0 ? (stats.invitationsOpened / stats.invitations) * 100 : 0} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center">
                            <div className="mr-2 h-3 w-3 rounded-full bg-green-500" />
                            <span>Responded</span>
                          </div>
                          <span className="font-medium">
                            {stats.rsvpResponses}/{stats.invitations}
                          </span>
                        </div>
                        <Progress value={stats.invitations > 0 ? (stats.rsvpResponses / stats.invitations) * 100 : 0} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center">
                            <div className="mr-2 h-3 w-3 rounded-full bg-blue-500" />
                            <span>Attending</span>
                          </div>
                          <span className="font-medium">
                            {stats.confirmedGuests}/{stats.rsvpResponses}
                          </span>
                        </div>
                        <Progress value={stats.rsvpResponses > 0 ? (stats.confirmedGuests / stats.rsvpResponses) * 100 : 0} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Recent RSVP Responses</CardTitle>
                    <CardDescription>
                      {stats.recentResponses.length > 0 
                        ? `You have received ${stats.recentResponses.length} responses`
                        : "No RSVP responses yet"
                      }
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {stats.recentResponses.length > 0 ? (
                      <div className="space-y-4">
                        {stats.recentResponses.map((response) => (
                          <div key={response.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                            <div className="flex items-center space-x-3">
                              <div className="space-y-1">
                                <p className="font-medium leading-none">{response.name}</p>
                                <p className="text-sm text-muted-foreground">{response.email}</p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <span 
                                className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                                  response.status === "attending" 
                                    ? "bg-green-100 text-green-800" 
                                    : response.status === "not-attending" 
                                    ? "bg-red-100 text-red-800" 
                                    : "bg-amber-100 text-amber-800"
                                }`}
                              >
                                {response.status === "attending" 
                                  ? "Attending" 
                                  : response.status === "not-attending" 
                                  ? "Not Attending" 
                                  : "Pending"
                                }
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-32 text-muted-foreground">
                        No RSVP responses yet
                      </div>
                    )}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Your Wedding</CardTitle>
                    <CardDescription>Manage your wedding details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-medium leading-none">Quick Actions</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" className="h-auto flex flex-col items-center justify-center p-4 space-y-2" asChild>
                          <Link href="/dashboard/guests">
                            <Users className="h-5 w-5 text-rose-500" />
                            <span className="text-xs">Manage Guests</span>
                          </Link>
                        </Button>
                        <Button variant="outline" className="h-auto flex flex-col items-center justify-center p-4 space-y-2" asChild>
                          <Link href="/dashboard/qr">
                            <QrCode className="h-5 w-5 text-rose-500" />
                            <span className="text-xs">QR Check-in</span>
                          </Link>
                        </Button>
                        <Button variant="outline" className="h-auto flex flex-col items-center justify-center p-4 space-y-2" asChild>
                          <Link href="/dashboard/settings">
                            <Settings className="h-5 w-5 text-rose-500" />
                            <span className="text-xs">Settings</span>
                          </Link>
                        </Button>
                        <Button variant="outline" className="h-auto flex flex-col items-center justify-center p-4 space-y-2" asChild>
                          <Link href={`/wedding/preview`}>
                            <Heart className="h-5 w-5 text-rose-500" />
                            <span className="text-xs">Preview</span>
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="guests">
              <Card>
                <CardHeader>
                  <CardTitle>Guest Management</CardTitle>
                  <CardDescription>Manage your guest list and invitations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center py-8">
                    <Link href="/dashboard/guests">
                      <Button className="bg-rose-500 hover:bg-rose-600">Go to Guest Management</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="gifts">
              <Card>
                <CardHeader>
                  <CardTitle>Gift Registry</CardTitle>
                  <CardDescription>Manage your gift registry and track received gifts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center py-8">
                    <Link href="/dashboard/gifts">
                      <Button className="bg-rose-500 hover:bg-rose-600">Go to Gift Registry</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Wedding Settings</CardTitle>
                  <CardDescription>Customize your wedding details and preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center py-8">
                    <Link href="/dashboard/settings">
                      <Button className="bg-rose-500 hover:bg-rose-600">Go to Settings</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  )
}

