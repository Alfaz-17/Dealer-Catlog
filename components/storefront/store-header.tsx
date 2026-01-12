"use client"

import Link from "next/link"
import { MapPin, BadgeCheck, Instagram, Facebook, Globe } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Business {
  businessName: string
  logo?: string
  banner?: string
  description?: string
  phone?: string
  whatsapp?: string
  email?: string
  address?: string
  brandColor?: string
  category?: string
  createdAt?: string | Date
  socialLinks?: {
    instagram?: string
    facebook?: string
    website?: string
  }
}

interface StoreHeaderProps {
  business: Business
  productCount?: number
}

export function StoreHeader({ business, productCount = 0 }: StoreHeaderProps) {
  const memberSince = business.createdAt 
    ? new Date(business.createdAt).getFullYear() 
    : new Date().getFullYear()

  return (
    <div className="relative mb-8">
      {/* Banner with Gradient Overlay */}
      <div className="relative h-48 md:h-80 overflow-hidden">
        {business.banner ? (
          <>
            <img
              src={business.banner}
              alt={business.businessName}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </>
        ) : (
          <div 
            className="w-full h-full relative"
            style={{
              background: `linear-gradient(135deg, ${business.brandColor || "#000000"} 0%, ${business.brandColor || "#1a1a1a"} 100%)`
            }}
          >
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        )}
      </div>

      {/* Business Info Container */}
      <div className="max-w-7xl mx-auto px-4 z-10 relative">
        <div className="flex flex-col md:flex-row gap-4 items-start -mt-12 md:-mt-16">
          {/* Logo */}
          <div className="shrink-0 relative">
            {business.logo ? (
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl border-[4px] border-white bg-white overflow-hidden shadow-xl ring-1 ring-black/5">
                <img
                  src={business.logo}
                  alt={business.businessName}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div 
                className="w-24 h-24 md:w-32 md:h-32 rounded-3xl border-[4px] border-white shadow-xl flex items-center justify-center text-white text-3xl font-bold ring-1 ring-black/5"
                style={{ backgroundColor: business.brandColor || "#000000" }}
              >
                {business.businessName.charAt(0)}
              </div>
            )}
           
          </div>

          {/* Business Details */}
          <div className="flex-1 pt-2 md:pt-16 space-y-3">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                   <div className="flex items-center gap-2 mb-1">
                      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">{business.businessName}</h1>
                      <BadgeCheck className="h-5 w-5 text-blue-500 fill-blue-50" />
                   </div>
                   
                   <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
                      {business.category && (
                        <span className="font-medium text-gray-700">{business.category}</span>
                      )}
                      <span className="w-1 h-1 rounded-full bg-gray-300" />
                      <span>{productCount} Items</span>
                      <span className="w-1 h-1 rounded-full bg-gray-300" />
                      <span>Since {memberSince}</span>
                   </div>
                </div>

                {/* Social Links */}
                 {(business.socialLinks?.instagram || business.socialLinks?.facebook || business.socialLinks?.website) && (
                    <div className="flex items-center gap-2">
                       {business.socialLinks.instagram && (
                        <Link href={business.socialLinks.instagram} target="_blank" className="p-2 bg-gray-50 hover:bg-white rounded-full transition-all hover:scale-110 hover:shadow-sm border border-transparent hover:border-gray-100">
                          <Instagram className="h-5 w-5 text-pink-600" />
                        </Link>
                      )}
                       {business.socialLinks.facebook && (
                        <Link href={business.socialLinks.facebook} target="_blank" className="p-2 bg-gray-50 hover:bg-white rounded-full transition-all hover:scale-110 hover:shadow-sm border border-transparent hover:border-gray-100">
                          <Facebook className="h-5 w-5 text-blue-600" />
                        </Link>
                      )}
                       {business.socialLinks.website && (
                        <Link href={business.socialLinks.website} target="_blank" className="p-2 bg-gray-50 hover:bg-white rounded-full transition-all hover:scale-110 hover:shadow-sm border border-transparent hover:border-gray-100">
                          <Globe className="h-5 w-5 text-gray-600" />
                        </Link>
                      )}
                    </div>
                  )}
             </div>

             {/* Description & Address */}
             <div className="space-y-2 max-w-3xl">
                {business.description && (
                  <p className="text-gray-600 leading-relaxed text-sm md:text-base">{business.description}</p>
                )}
                
                {business.address && (
                    <Link
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.address)}`}
                      target="_blank"
                      className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-primary transition-colors"
                    >
                      <MapPin className="h-3.5 w-3.5" />
                      {business.address}
                    </Link>
                  )}
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}
