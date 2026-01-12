"use client"

import { Phone, Mail, MapPin, Globe, Instagram, Facebook, Clock, Calendar } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface Business {
  businessName: string
  description?: string
  phone?: string
  email?: string
  address?: string
  whatsapp?: string
  socialLinks?: {
    instagram?: string
    facebook?: string
    website?: string
  }
  createdAt?: string | Date
  category?: string
}

interface BusinessAboutSectionProps {
  business: Business
  productCount?: number
}

export function BusinessAboutSection({ business, productCount = 0 }: BusinessAboutSectionProps) {
  const memberSince = business.createdAt 
    ? new Date(business.createdAt).getFullYear() 
    : new Date().getFullYear()

  const contactItems = [
    {
      icon: Phone,
      label: "Phone",
      value: business.phone,
      href: business.phone ? `tel:${business.phone}` : undefined,
    },
    {
      icon: Mail,
      label: "Email",
      value: business.email,
      href: business.email ? `mailto:${business.email}` : undefined,
    },
    {
      icon: MapPin,
      label: "Address",
      value: business.address,
      href: business.address 
        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.address)}`
        : undefined,
    },
  ]

  const socialItems = [
    {
      icon: Instagram,
      label: "Instagram",
      value: business.socialLinks?.instagram,
      color: "text-pink-600",
    },
    {
      icon: Facebook,
      label: "Facebook",
      value: business.socialLinks?.facebook,
      color: "text-blue-600",
    },
    {
      icon: Globe,
      label: "Website",
      value: business.socialLinks?.website,
      color: "text-gray-600",
    },
  ].filter((item) => item.value)

  return (
    <div className="space-y-6">
      {/* About Section */}
      <Card className="p-6 space-y-4">
        <h2 className="text-xl font-bold">About This Business</h2>
        
        {business.description ? (
          <p className="text-muted-foreground leading-relaxed">{business.description}</p>
        ) : (
          <p className="text-muted-foreground italic">
            Welcome to {business.businessName}. Browse our collection of quality products.
          </p>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-primary">{productCount}</div>
            <div className="text-xs text-muted-foreground">Products Listed</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-primary">{memberSince}</div>
            <div className="text-xs text-muted-foreground">Member Since</div>
          </div>
          {business.category && (
            <div className="text-center p-3 bg-gray-50 rounded-lg col-span-2 md:col-span-1">
              <div className="text-sm font-semibold text-primary truncate">{business.category}</div>
              <div className="text-xs text-muted-foreground">Category</div>
            </div>
          )}
        </div>
      </Card>

      {/* Contact Information */}
      <Card className="p-6 space-y-4">
        <h3 className="font-semibold text-lg">Contact Information</h3>
        <div className="space-y-3">
          {contactItems.map((item) => {
            if (!item.value) return null

            const Icon = item.icon
            const content = (
              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <Icon className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-muted-foreground">{item.label}</div>
                  <div className="text-sm font-medium break-words">{item.value}</div>
                </div>
              </div>
            )

            return item.href ? (
              <Link
                key={item.label}
                href={item.href}
                target={item.label === "Address" ? "_blank" : undefined}
                className="block"
              >
                {content}
              </Link>
            ) : (
              <div key={item.label}>{content}</div>
            )
          })}
        </div>
      </Card>

      {/* Social Media Links */}
      {socialItems.length > 0 && (
        <Card className="p-6 space-y-4">
          <h3 className="font-semibold text-lg">Follow Us</h3>
          <div className="flex flex-wrap gap-3">
            {socialItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.label}
                  href={item.value!}
                  target="_blank"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Icon className={`h-5 w-5 ${item.color}`} />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              )
            })}
          </div>
        </Card>
      )}

      {/* Trust Indicators */}
      <Card className="p-6 space-y-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <h3 className="font-semibold text-lg">Why Choose Us?</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <Badge variant="secondary" className="w-2 h-2 rounded-full bg-green-500 p-0" />
            </div>
            <div>
              <div className="font-medium text-sm">Verified Seller</div>
              <div className="text-xs text-muted-foreground">Trusted by customers</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="font-medium text-sm">Established {memberSince}</div>
              <div className="text-xs text-muted-foreground">Years of experience</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <Phone className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="font-medium text-sm">Quick Response</div>
              <div className="text-xs text-muted-foreground">Available via call & WhatsApp</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
