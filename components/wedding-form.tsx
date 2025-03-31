"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface WeddingFormProps {
  wedding?: any
  isEditing?: boolean
}

interface FormData {
  brideName: string;
  groomName: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  city: string;
  country: string;
  theme: string;
  story: string;
  slug: string;
  parentNames: {
    bride: {
      father: string;
      mother: string;
    };
    groom: {
      father: string;
      mother: string;
    };
  };
  [key: string]: any;
}

export function WeddingForm({ wedding, isEditing = false }: WeddingFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
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
    slug: wedding?.slug || "",
    parentNames: {
      bride: {
        father: wedding?.parentNames?.bride?.father || "",
        mother: wedding?.parentNames?.bride?.mother || ""
      },
      groom: {
        father: wedding?.parentNames?.groom?.father || "",
        mother: wedding?.parentNames?.groom?.mother || ""
      }
    }
  })

  // Generate slug when bride or groom name changes
  useEffect(() => {
    if (!isEditing && formData.brideName && formData.groomName) {
      const bride = formData.brideName.toLowerCase().replace(/\s+/g, '-');
      const groom = formData.groomName.toLowerCase().replace(/\s+/g, '-');
      const newSlug = `${bride}-and-${groom}-${Date.now().toString().slice(-4)}`;
      
      setFormData(prev => ({
        ...prev,
        slug: newSlug
      }));
    }
  }, [formData.brideName, formData.groomName, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    // Handle nested fields for parent names
    if (name.includes('.')) {
      const [parent, person, field] = name.split('.')
      setFormData((prev) => {
        const newState = { ...prev };
        if (parent === 'parentNames' && (person === 'bride' || person === 'groom') && (field === 'father' || field === 'mother')) {
          newState.parentNames = {
            ...prev.parentNames,
            [person]: {
              ...prev.parentNames[person],
              [field]: value
            }
          };
        }
        return newState;
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Make sure slug exists
      if (!formData.slug) {
        const bride = formData.brideName.toLowerCase().replace(/\s+/g, '-');
        const groom = formData.groomName.toLowerCase().replace(/\s+/g, '-');
        formData.slug = `${bride}-and-${groom}-${Date.now().toString().slice(-4)}`;
      }

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
            
            {/* Parent Names Accordion */}
            <div className="md:col-span-2">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="parents">
                  <AccordionTrigger>Parent Information (Optional)</AccordionTrigger>
                  <AccordionContent>
                    <div className="grid gap-6 md:grid-cols-2 pt-4">
                      <div className="space-y-4">
                        <h3 className="font-medium">Bride's Parents</h3>
                        <div className="space-y-2">
                          <Label htmlFor="parentNames.bride.father">Father's Name</Label>
                          <Input
                            id="parentNames.bride.father"
                            name="parentNames.bride.father"
                            value={formData.parentNames.bride.father}
                            onChange={handleChange}
                            placeholder="Enter bride's father's name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="parentNames.bride.mother">Mother's Name</Label>
                          <Input
                            id="parentNames.bride.mother"
                            name="parentNames.bride.mother"
                            value={formData.parentNames.bride.mother}
                            onChange={handleChange}
                            placeholder="Enter bride's mother's name"
                          />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h3 className="font-medium">Groom's Parents</h3>
                        <div className="space-y-2">
                          <Label htmlFor="parentNames.groom.father">Father's Name</Label>
                          <Input
                            id="parentNames.groom.father"
                            name="parentNames.groom.father"
                            value={formData.parentNames.groom.father}
                            onChange={handleChange}
                            placeholder="Enter groom's father's name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="parentNames.groom.mother">Mother's Name</Label>
                          <Input
                            id="parentNames.groom.mother"
                            name="parentNames.groom.mother"
                            value={formData.parentNames.groom.mother}
                            onChange={handleChange}
                            placeholder="Enter groom's mother's name"
                          />
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            
            {isEditing && (
              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  required
                  placeholder="Enter URL slug"
                />
                <p className="text-xs text-muted-foreground">The URL for your wedding page (e.g. yourwedding.com/bride-and-groom)</p>
              </div>
            )}
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="theme">Wedding Theme</Label>
            <Select name="theme" value={formData.theme} onValueChange={(value) => handleSelectChange("theme", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="modern">Modern</SelectItem>
                <SelectItem value="traditional">Traditional</SelectItem>
                <SelectItem value="javanese">Javanese</SelectItem>
                <SelectItem value="sundanese">Sundanese</SelectItem>
                <SelectItem value="minang">Minang</SelectItem>
                <SelectItem value="islamic">Islamic</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="story">Your Love Story</Label>
            <Textarea
              id="story"
              name="story"
              value={formData.story}
              onChange={handleChange}
              placeholder="Share your love story..."
              className="min-h-32"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : isEditing ? "Update Wedding" : "Create Wedding"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

