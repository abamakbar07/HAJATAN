"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useAuth } from "@/providers/auth-provider"
import {
  Calendar,
  ChevronDown,
  Eye,
  Gift,
  Heart,
  Mail,
  MessageSquare,
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
  weddingId: string;
  weddingSlug: string;  // Add this new field
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
    weddingId: "",
    weddingSlug: "",
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
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          {loading ? "Loading..." : `Welcome back, ${user?.name?.split(" ")[0] || "User"}`}
        </h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            {weddingDate ? formatDate(weddingDate) : "No wedding date set"}
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
            <TabsTrigger value="actions">Quick Actions</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
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
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Recent Responses</CardTitle>
                  <CardDescription>Latest guests who have responded to your invitation</CardDescription>
                </CardHeader>
                <CardContent>
                  {stats.recentResponses.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                      No responses yet
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {stats.recentResponses.slice(0, 5).map((response) => (
                        <div
                          key={response.id}
                          className="flex items-center justify-between border-b pb-2 last:border-0"
                        >
                          <div>
                            <p className="font-medium">{response.name}</p>
                            <p className="text-xs text-muted-foreground">{response.email}</p>
                          </div>
                          <div className={`text-sm px-2 py-1 rounded-full ${
                            response.status === "attending" 
                              ? "bg-green-100 text-green-700" 
                              : response.status === "not-attending"
                              ? "bg-red-100 text-red-700"
                              : "bg-amber-100 text-amber-700"
                          }`}>
                            {response.status === "attending" 
                              ? "Attending" 
                              : response.status === "not-attending"
                              ? "Not Attending"
                              : "Pending"}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="guests" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Guest Management</h3>
              <Link href="/dashboard/guest-management">
                <Button variant="outline" size="sm">
                  View All Guests
                </Button>
              </Link>
            </div>
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <Link href="/dashboard/guest-management">
                    <Button>
                      <Users className="mr-2 h-4 w-4" />
                      Manage Guests
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="actions" className="space-y-4">
            <h3 className="text-lg font-medium">Quick Actions</h3>
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
              <Card className="col-span-1">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center gap-2">
                    <Link href={`/wedding/preview`} className="flex flex-col items-center">
                      <Eye className="h-8 w-8 text-rose-500" />
                      <span className="text-xs">Preview Invitation</span>
                    </Link>
                  </div>
                </CardContent>
              </Card>
              <Card className="col-span-1">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center gap-2">
                    <Link 
                      href={weddingDate ? `/dashboard/weddings/${stats.weddingSlug}/edit` : "/dashboard/weddings/new"} 
                      className="flex flex-col items-center"
                    >
                      <Settings className="h-8 w-8 text-rose-500" />
                      <span className="text-xs">{weddingDate ? "Edit Wedding" : "Create Wedding"}</span>
                    </Link>
                  </div>
                </CardContent>
              </Card>
              <Card className="col-span-1">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center gap-2">
                    <Link href="/dashboard/check-in" className="flex flex-col items-center">
                      <QrCode className="h-8 w-8 text-rose-500" />
                      <span className="text-xs">QR Check-in</span>
                    </Link>
                  </div>
                </CardContent>
              </Card>
              <Card className="col-span-1">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center gap-2">
                    <Link href="/dashboard/guest-management/share" className="flex flex-col items-center">
                      <Heart className="h-8 w-8 text-rose-500" />
                      <span className="text-xs">Share Invitation</span>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </>
  )
}

