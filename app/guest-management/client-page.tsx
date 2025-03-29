"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowUpDown, ChevronDown, Download, Heart, Menu, Plus, Search, Settings, Upload, Users } from "lucide-react"
import { useApi } from "@/hooks/use-api"
import { useToast } from "@/hooks/use-toast"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Guest {
  _id: string
  name: string
  email: string
  phone?: string
  group: string
  status: "pending" | "attending" | "not-attending"
  numberOfGuests: number
  message?: string
  qrCode?: string
  checkedIn: boolean
  checkedInAt?: string
  createdAt: string
  updatedAt: string
}

export default function GuestManagementClientPage() {
  const [activeWeddingId, setActiveWeddingId] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  // Fetch weddings
  const { data: weddings, loading: weddingsLoading } = useApi<any[]>("/api/weddings")

  // Set active wedding ID when weddings are loaded
  useEffect(() => {
    if (weddings && weddings.length > 0) {
      setActiveWeddingId(weddings[0]._id)
    }
  }, [weddings])

  // Fetch guests for the active wedding
  const {
    data: guests,
    loading: guestsLoading,
    error: guestsError,
    fetchData: refetchGuests,
  } = useApi<Guest[]>(activeWeddingId ? `/api/guests?weddingId=${activeWeddingId}` : "", {
    method: "GET",
  })

  // Filter guests based on search term
  const filteredGuests = guests?.filter(
    (guest) =>
      guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (guest.phone && guest.phone.includes(searchTerm)),
  )

  // Handle guest deletion
  const handleDeleteGuest = async (guestId: string) => {
    try {
      await fetch(`/api/guests/${guestId}`, {
        method: "DELETE",
      })

      toast({
        title: "Guest deleted",
        description: "The guest has been removed successfully.",
      })

      // Refetch guests
      refetchGuests()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete guest. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Handle sending reminder
  const handleSendReminder = async (guestId: string) => {
    try {
      // This would be implemented in a real app
      toast({
        title: "Reminder sent",
        description: "A reminder has been sent to the guest.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send reminder. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
        <Link className="flex items-center gap-2 font-semibold" href="/">
          <Heart className="h-6 w-6 text-rose-500" />
          <span className="hidden md:inline">Hajatan</span>
        </Link>
        <div className="w-full flex-1">
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link className="text-muted-foreground hover:text-foreground" href="/dashboard">
              Dashboard
            </Link>
            <Link className="font-medium" href="/guest-management">
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
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </div>
      </header>
      <main className="flex-1 space-y-4 p-4 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Guest Management</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="hidden md:flex">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button
              size="sm"
              className="bg-rose-500 hover:bg-rose-600"
              onClick={() => {
                // This would open a modal in a real app
                toast({
                  title: "Add Guest",
                  description: "This would open a modal to add a new guest.",
                })
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Guest
            </Button>
          </div>
        </div>

        {weddingsLoading ? (
          <div className="flex justify-center p-8">
            <p>Loading weddings...</p>
          </div>
        ) : weddings && weddings.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <h3 className="text-lg font-medium mb-2">No Weddings Found</h3>
              <p className="text-muted-foreground mb-4">You need to create a wedding before you can manage guests.</p>
              <Button className="bg-rose-500 hover:bg-rose-600">
                <Plus className="mr-2 h-4 w-4" />
                Create Wedding
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col gap-4 md:flex-row">
            <Card className="flex-1">
              <CardHeader>
                <CardTitle>Guest List</CardTitle>
                <CardDescription>Manage your wedding guests and track their RSVP status</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <TabsList>
                      <TabsTrigger value="all">All Guests</TabsTrigger>
                      <TabsTrigger value="attending">Attending</TabsTrigger>
                      <TabsTrigger value="not-attending">Not Attending</TabsTrigger>
                      <TabsTrigger value="pending">Pending</TabsTrigger>
                    </TabsList>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="search"
                          placeholder="Search guests..."
                          className="w-[200px] pl-8"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Upload className="mr-2 h-4 w-4" />
                            Import
                            <ChevronDown className="ml-2 h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Import Options</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <svg
                              className="mr-2 h-4 w-4"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z" />
                            </svg>
                            CSV File
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <svg
                              className="mr-2 h-4 w-4"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z" />
                            </svg>
                            Google Contacts
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <svg
                              className="mr-2 h-4 w-4"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z" />
                            </svg>
                            Excel File
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <TabsContent value="all" className="space-y-4">
                    {guestsLoading ? (
                      <div className="flex justify-center p-8">
                        <p>Loading guests...</p>
                      </div>
                    ) : guestsError ? (
                      <div className="flex justify-center p-8 text-red-500">
                        <p>Error loading guests. Please try again.</p>
                      </div>
                    ) : filteredGuests && filteredGuests.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[250px]">
                              <Button variant="ghost" className="p-0 font-medium">
                                Name
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                              </Button>
                            </TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Group</TableHead>
                            <TableHead>
                              <Button variant="ghost" className="p-0 font-medium">
                                Status
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                              </Button>
                            </TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredGuests.map((guest) => (
                            <TableRow key={guest._id}>
                              <TableCell className="font-medium">{guest.name}</TableCell>
                              <TableCell>
                                <div className="text-sm">{guest.email}</div>
                                {guest.phone && <div className="text-xs text-muted-foreground">{guest.phone}</div>}
                              </TableCell>
                              <TableCell>{guest.group}</TableCell>
                              <TableCell>
                                <div
                                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                    guest.status === "attending"
                                      ? "bg-green-100 text-green-800"
                                      : guest.status === "pending"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {guest.status === "attending"
                                    ? "Attending"
                                    : guest.status === "pending"
                                      ? "Pending"
                                      : "Not Attending"}
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <span className="sr-only">Open menu</span>
                                      <ChevronDown className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>Edit Guest</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleSendReminder(guest._id)}>
                                      Send Reminder
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>View Details</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      className="text-red-600"
                                      onClick={() => handleDeleteGuest(guest._id)}
                                    >
                                      Remove Guest
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="flex h-[400px] items-center justify-center rounded-md border border-dashed">
                        <div className="flex flex-col items-center gap-1 text-center">
                          <Users className="h-10 w-10 text-muted-foreground" />
                          <h3 className="text-lg font-medium">No Guests Found</h3>
                          <p className="text-sm text-muted-foreground">
                            {searchTerm ? "No guests match your search criteria" : "You haven't added any guests yet"}
                          </p>
                          {!searchTerm && (
                            <Button className="mt-4 bg-rose-500 hover:bg-rose-600" size="sm">
                              <Plus className="mr-2 h-4 w-4" />
                              Add First Guest
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </TabsContent>
                  <TabsContent value="attending" className="space-y-4">
                    <div className="flex h-[400px] items-center justify-center rounded-md border border-dashed">
                      <div className="flex flex-col items-center gap-1 text-center">
                        <Users className="h-10 w-10 text-muted-foreground" />
                        <h3 className="text-lg font-medium">Attending Guests</h3>
                        <p className="text-sm text-muted-foreground">
                          {guests?.filter((g) => g.status === "attending").length || 0} guests have confirmed attendance
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="not-attending" className="space-y-4">
                    <div className="flex h-[400px] items-center justify-center rounded-md border border-dashed">
                      <div className="flex flex-col items-center gap-1 text-center">
                        <Users className="h-10 w-10 text-muted-foreground" />
                        <h3 className="text-lg font-medium">Not Attending Guests</h3>
                        <p className="text-sm text-muted-foreground">
                          {guests?.filter((g) => g.status === "not-attending").length || 0} guests have declined the
                          invitation
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="pending" className="space-y-4">
                    <div className="flex h-[400px] items-center justify-center rounded-md border border-dashed">
                      <div className="flex flex-col items-center gap-1 text-center">
                        <Users className="h-10 w-10 text-muted-foreground" />
                        <h3 className="text-lg font-medium">Pending Responses</h3>
                        <p className="text-sm text-muted-foreground">
                          {guests?.filter((g) => g.status === "pending").length || 0} guests haven't responded yet
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}

