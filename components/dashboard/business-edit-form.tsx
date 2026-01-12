"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SingleImageUpload } from "@/components/products/single-image-upload"
import { Loader2, Store, MapPin, Phone, Mail, MessageCircle, Calendar, Palette } from "lucide-react"

interface Business {
  _id: string
  businessName: string
  slug: string
  description?: string
  category?: string
  logo?: string
  banner?: string
  phone?: string
  email?: string
  whatsapp?: string
  address?: string
  brandColor?: string
  yearEstablished?: number
  socialLinks?: {
    instagram?: string
    facebook?: string
    website?: string
  }
}

interface BusinessEditFormProps {
  business: Business
}

export function BusinessEditForm({ business }: BusinessEditFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    description: business.description || "",
    category: business.category || "",
    logo: business.logo || "",
    banner: business.banner || "",
    phone: business.phone || "",
    email: business.email || "",
    whatsapp: business.whatsapp || "",
    address: business.address || "",
    brandColor: business.brandColor || "#000000",
    yearEstablished: business.yearEstablished || new Date().getFullYear(),
    instagram: business.socialLinks?.instagram || "",
    facebook: business.socialLinks?.facebook || "",
    website: business.socialLinks?.website || "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)
    setLoading(true)

    try {
      const response = await fetch(`/api/business/${business._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: formData.description,
          category: formData.category,
          logo: formData.logo,
          banner: formData.banner,
          phone: formData.phone,
          email: formData.email,
          whatsapp: formData.whatsapp,
          address: formData.address,
          brandColor: formData.brandColor,
          yearEstablished: formData.yearEstablished,
          socialLinks: {
            instagram: formData.instagram,
            facebook: formData.facebook,
            website: formData.website,
          },
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to update business")
      }

      setSuccess(true)
      router.refresh()
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      setError(err.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            <CardTitle>Basic Information</CardTitle>
          </div>
          <CardDescription>
            Update your business details and description
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">Business Category</Label>
            <Input
              id="category"
              placeholder="Auto Dealer, Furniture, Electronics..."
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Tell customers about your business..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              disabled={loading}
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              This will appear on your public store page
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="yearEstablished">
              <Calendar className="inline h-4 w-4 mr-1" />
              Year Established
            </Label>
            <Input
              id="yearEstablished"
              type="number"
              min="1900"
              max={new Date().getFullYear()}
              placeholder="2020"
              value={formData.yearEstablished}
              onChange={(e) => setFormData({ ...formData, yearEstablished: parseInt(e.target.value) || new Date().getFullYear() })}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="brandColor">
              <Palette className="inline h-4 w-4 mr-1" />
              Brand Color
            </Label>
            <div className="flex gap-2">
              <Input
                id="brandColor"
                type="color"
                value={formData.brandColor}
                onChange={(e) => setFormData({ ...formData, brandColor: e.target.value })}
                disabled={loading}
                className="w-20 h-10"
              />
              <Input
                type="text"
                value={formData.brandColor}
                onChange={(e) => setFormData({ ...formData, brandColor: e.target.value })}
                disabled={loading}
                placeholder="#000000"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Info */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            <CardTitle>Contact Information</CardTitle>
          </div>
          <CardDescription>
            How customers can reach you
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">
              <Phone className="inline h-4 w-4 mr-1" />
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+91 98765 43210"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="whatsapp">
              <MessageCircle className="inline h-4 w-4 mr-1" />
              WhatsApp Number
            </Label>
            <Input
              id="whatsapp"
              type="tel"
              placeholder="+91 98765 43210"
              value={formData.whatsapp}
              onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              <Mail className="inline h-4 w-4 mr-1" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="business@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">
              <MapPin className="inline h-4 w-4 mr-1" />
              Business Address
            </Label>
            <Textarea
              id="address"
              placeholder="123 Main Street, City, State - 123456"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              disabled={loading}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card>
        <CardHeader>
          <CardTitle>Social Media</CardTitle>
          <CardDescription>
            Link your social media profiles
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="instagram">Instagram</Label>
            <Input
              id="instagram"
              type="url"
              placeholder="https://instagram.com/yourprofile"
              value={formData.instagram}
              onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="facebook">Facebook</Label>
            <Input
              id="facebook"
              type="url"
              placeholder="https://facebook.com/yourpage"
              value={formData.facebook}
              onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              type="url"
              placeholder="https://yourbusiness.com"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              disabled={loading}
            />
          </div>
        </CardContent>
      </Card>

      {/* Branding */}
      <Card>
        <CardHeader>
          <CardTitle>Branding</CardTitle>
          <CardDescription>
            Upload your logo and banner image
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2">
            <SingleImageUpload
              image={formData.logo}
              onChange={(url) => setFormData({ ...formData, logo: url })}
              onRemove={() => setFormData({ ...formData, logo: "" })}
              label="Logo"
              aspectRatio="aspect-square"
            />
            
            <SingleImageUpload
              image={formData.banner}
              onChange={(url) => setFormData({ ...formData, banner: url })}
              onRemove={() => setFormData({ ...formData, banner: "" })}
              label="Banner Image"
              aspectRatio="aspect-video"
            />
          </div>
        </CardContent>
      </Card>

      {/* Error/Success Messages */}
      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 text-green-700 rounded-lg border border-green-200">
          ✓ Business profile updated successfully!
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button type="submit" disabled={loading} size="lg">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </form>
  )
}
