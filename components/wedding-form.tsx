"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface WeddingFormProps {
  wedding?: any
  isEditing?: boolean
}

export function WeddingForm({ wedding, isEditing = false }: WeddingFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    brideName: wedding?.brideName || "",
    groomName: wedding?.groomName || "",
    date: wedding?.date ? new Date(wedding.date).toISOString().split("T")[0] : "",
    time: wedding?.time || "",
    venue: wedding?.venue || "",
    address: wedding?.address || "",
    city: wedding?.city || "",
    country: wedding?.country || "",
    theme: wedding?.theme || "modern",
    story: wedding?.story || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = isEditing ? `/api/weddings/${wedding._id}` : "/api/weddings"
      const method = isEditing ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Something went wrong")
      }

      toast({
        title: isEditing ? "Wedding Updated" : "Wedding Created",
        description: isEditing
          ? "Your wedding details have been updated successfully."
          : "Your wedding has been created successfully.",
      })

      router.push("/dashboard")
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Wedding Details" : "Create New Wedding"}</CardTitle>
        <CardDescription>
          {isEditing ? "Update your wedding information and preferences" : "Enter the details for your wedding"}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="brideName">Bride's Name</Label>
              <Input
                id="brideName"
                name="brideName"
                value={formData.brideName}
                onChange={handleChange}
                required
                placeholder="Enter bride's name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="groomName">Groom's Name</Label>
              <Input
                id="groomName"
                name="groomName"
                value={formData.groomName}
                onChange={handleChange}
                required
                placeholder="Enter groom's name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Wedding Date</Label>
              <Input id="date" name="date" type="date" value={formData.date} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Wedding Time</Label>
              <Input id="time" name="time" type="time" value={formData.time} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="venue">Venue</Label>
              <Input
                id="venue"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                required
                placeholder="Enter venue name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                placeholder="Enter venue address"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                placeholder="Enter city"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
                placeholder="Enter country"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="theme">Theme</Label>
              <Select value={formData.theme} onValueChange={(value) => handleSelectChange("theme", value)}>
                <SelectTrigger id="theme">
                  <SelectValue placeholder="Select a theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="modern">Modern</SelectItem>
                  <SelectItem value="traditional">Traditional</SelectItem>
                  <SelectItem value="islamic">Islamic</SelectItem>
                  <SelectItem value="minimalist">Minimalist</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="story">Your Love Story</Label>
            <Textarea
              id="story"
              name="story"
              value={formData.story}
              onChange={handleChange}
              placeholder="Share your love story here..."
              className="min-h-[120px]"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" className="bg-rose-500 hover:bg-rose-600" disabled={loading}>
            {loading ? (isEditing ? "Updating..." : "Creating...") : isEditing ? "Update Wedding" : "Create Wedding"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

