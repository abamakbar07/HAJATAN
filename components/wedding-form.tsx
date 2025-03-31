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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import GalleryUploader from "./GalleryUploader"
import PhotoGallery from "./PhotoGallery"
import { GalleryEffect, GalleryLayout } from "./PhotoGallery"

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
  themeConfig: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    headerStyle: string;
    backgroundImage?: string;
  };
  story: string;
  slug: string;
  gallery: string[];
  galleryLayout: GalleryLayout;
  galleryConfig: {
    spacing: number;
    showCaptions: boolean;
    borderRadius: number;
    effect: GalleryEffect;
  };
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
    themeConfig: {
      primaryColor: wedding?.themeConfig?.primaryColor || "#000000",
      secondaryColor: wedding?.themeConfig?.secondaryColor || "#ffffff",
      fontFamily: wedding?.themeConfig?.fontFamily || "Inter",
      headerStyle: wedding?.themeConfig?.headerStyle || "centered",
      backgroundImage: wedding?.themeConfig?.backgroundImage || "",
    },
    story: wedding?.story || "",
    slug: wedding?.slug || "",
    gallery: wedding?.gallery || [],
    galleryLayout: wedding?.galleryLayout || "grid",
    galleryConfig: {
      spacing: wedding?.galleryConfig?.spacing || 8,
      showCaptions: wedding?.galleryConfig?.showCaptions || false,
      borderRadius: wedding?.galleryConfig?.borderRadius || 8,
      effect: wedding?.galleryConfig?.effect || "zoom",
    },
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
    
    // Handle nested fields
    if (name.includes('.')) {
      const [parent, child, subchild] = name.split('.')
      setFormData((prev) => {
        const newState = { ...prev };
        if (parent === 'parentNames' && (child === 'bride' || child === 'groom') && (subchild === 'father' || subchild === 'mother')) {
          newState.parentNames = {
            ...prev.parentNames,
            [child]: {
              ...prev.parentNames[child],
              [subchild]: value
            }
          };
        } else if (parent === 'themeConfig') {
          newState.themeConfig = {
            ...prev.themeConfig,
            [child]: value
          };
        } else if (parent === 'galleryConfig') {
          newState.galleryConfig = {
            ...prev.galleryConfig,
            [child]: value
          };
        }
        return newState;
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    if (name.includes('.')) {
      const [parent, field] = name.split('.')
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [field]: value
        }
      }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    if (name.includes('.')) {
      const [parent, field] = name.split('.')
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [field]: checked
        }
      }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: checked }))
    }
  }

  const handleSliderChange = (name: string, value: number[]) => {
    if (name.includes('.')) {
      const [parent, field] = name.split('.')
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [field]: value[0]
        }
      }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value[0] }))
    }
  }

  const handleGalleryChange = (images: string[]) => {
    setFormData((prev) => ({
      ...prev,
      gallery: images
    }))
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
        <Tabs defaultValue="details">
          <TabsList className="mx-6 mb-4">
            <TabsTrigger value="details">Basic Details</TabsTrigger>
            <TabsTrigger value="theme">Theme & Styling</TabsTrigger>
            <TabsTrigger value="gallery">Photo Gallery</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details">
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
          </TabsContent>
          
          <TabsContent value="theme">
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
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
                  <Label htmlFor="themeConfig.headerStyle">Header Style</Label>
                  <Select 
                    value={formData.themeConfig.headerStyle} 
                    onValueChange={(value) => handleSelectChange("themeConfig.headerStyle", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select header style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="centered">Centered</SelectItem>
                      <SelectItem value="side-by-side">Side by Side</SelectItem>
                      <SelectItem value="overlap">Overlap</SelectItem>
                      <SelectItem value="minimal">Minimal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="themeConfig.fontFamily">Font Family</Label>
                  <Select 
                    value={formData.themeConfig.fontFamily} 
                    onValueChange={(value) => handleSelectChange("themeConfig.fontFamily", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select font family" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter">Inter (Modern)</SelectItem>
                      <SelectItem value="Playfair Display">Playfair Display (Elegant)</SelectItem>
                      <SelectItem value="Montserrat">Montserrat (Clean)</SelectItem>
                      <SelectItem value="Dancing Script">Dancing Script (Script)</SelectItem>
                      <SelectItem value="Lora">Lora (Serif)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="themeConfig.primaryColor">Primary Color</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      type="color"
                      id="themeConfig.primaryColor"
                      name="themeConfig.primaryColor"
                      value={formData.themeConfig.primaryColor}
                      onChange={handleChange}
                      className="h-10 w-10 p-0 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={formData.themeConfig.primaryColor}
                      onChange={handleChange}
                      name="themeConfig.primaryColor"
                      placeholder="#000000"
                      className="flex-1"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="themeConfig.secondaryColor">Secondary Color</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      type="color"
                      id="themeConfig.secondaryColor"
                      name="themeConfig.secondaryColor"
                      value={formData.themeConfig.secondaryColor}
                      onChange={handleChange}
                      className="h-10 w-10 p-0 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={formData.themeConfig.secondaryColor}
                      onChange={handleChange}
                      name="themeConfig.secondaryColor"
                      placeholder="#ffffff"
                      className="flex-1"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="themeConfig.backgroundImage">Background Image URL</Label>
                  <Input
                    id="themeConfig.backgroundImage"
                    name="themeConfig.backgroundImage"
                    value={formData.themeConfig.backgroundImage}
                    onChange={handleChange}
                    placeholder="https://example.com/your-background.jpg"
                  />
                  <p className="text-xs text-muted-foreground">Optional: URL for a custom background image</p>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <h3 className="font-medium mb-4">Theme Preview</h3>
                <div 
                  className="border rounded-lg p-8 h-60 flex flex-col items-center justify-center"
                  style={{
                    backgroundColor: formData.themeConfig.primaryColor,
                    color: formData.themeConfig.secondaryColor,
                    fontFamily: formData.themeConfig.fontFamily,
                    backgroundImage: formData.themeConfig.backgroundImage ? `url(${formData.themeConfig.backgroundImage})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <h2 className="text-3xl mb-2 text-center">
                    {formData.brideName} & {formData.groomName}
                  </h2>
                  <p className="text-lg opacity-90 text-center">
                    {formData.date ? new Date(formData.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    }) : 'Wedding Date'}
                  </p>
                </div>
              </div>
            </CardContent>
          </TabsContent>
          
          <TabsContent value="gallery">
            <CardContent className="space-y-6">
              <GalleryUploader
                existingImages={formData.gallery}
                onImagesChange={handleGalleryChange}
              />
              
              <div className="space-y-4 pt-6 border-t">
                <h3 className="font-medium">Gallery Layout & Settings</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="galleryLayout">Layout Style</Label>
                  <Select 
                    value={formData.galleryLayout} 
                    onValueChange={(value) => handleSelectChange("galleryLayout", value as GalleryLayout)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select layout" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grid">Grid</SelectItem>
                      <SelectItem value="masonry">Masonry</SelectItem>
                      <SelectItem value="carousel">Carousel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="galleryConfig.effect">Image Effect</Label>
                  <Select 
                    value={formData.galleryConfig.effect} 
                    onValueChange={(value) => handleSelectChange("galleryConfig.effect", value as GalleryEffect)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select effect" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="zoom">Zoom</SelectItem>
                      <SelectItem value="fade">Fade</SelectItem>
                      <SelectItem value="slide">Slide</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="galleryConfig.spacing">Spacing Between Images</Label>
                    <span className="text-sm text-muted-foreground">{formData.galleryConfig.spacing}px</span>
                  </div>
                  <Slider
                    id="galleryConfig.spacing"
                    min={0}
                    max={16}
                    step={2}
                    value={[formData.galleryConfig.spacing]}
                    onValueChange={(value) => handleSliderChange("galleryConfig.spacing", value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="galleryConfig.borderRadius">Image Border Radius</Label>
                    <span className="text-sm text-muted-foreground">{formData.galleryConfig.borderRadius}px</span>
                  </div>
                  <Slider
                    id="galleryConfig.borderRadius"
                    min={0}
                    max={20}
                    step={2}
                    value={[formData.galleryConfig.borderRadius]}
                    onValueChange={(value) => handleSliderChange("galleryConfig.borderRadius", value)}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="galleryConfig.showCaptions"
                    checked={formData.galleryConfig.showCaptions}
                    onCheckedChange={(checked) => handleSwitchChange("galleryConfig.showCaptions", checked)}
                  />
                  <Label htmlFor="galleryConfig.showCaptions">Show Image Captions</Label>
                </div>
              </div>
              
              {formData.gallery.length > 0 && (
                <div className="pt-6 border-t">
                  <h3 className="font-medium mb-4">Gallery Preview</h3>
                  <div className="rounded-lg border p-4 bg-slate-50">
                    <PhotoGallery
                      images={formData.gallery}
                      layout={formData.galleryLayout}
                      config={formData.galleryConfig}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </TabsContent>
        </Tabs>
        
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

