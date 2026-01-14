"use client"

import Link from "next/link"
import { Share2, Instagram, Facebook, Calendar, Package, Star, Phone } from "lucide-react"
import { motion } from "framer-motion"

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
  return (
    <header className="relative pt-0 bg-[#F3F4F6]">
      {/* Banner */}
      <div className="relative h-48 md:h-80 overflow-hidden">
        {business.banner ? (
          <img
            src={business.banner}
            alt={business.businessName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div 
            className="w-full h-full opacity-20"
            style={{ backgroundColor: business.brandColor || "#3b82f6" }}
          />
        )}

        {/* Floating Share Button */}
        <div className="absolute top-6 right-6 z-20">
           <button 
             onClick={() => {
               if (navigator.share) {
                 navigator.share({
                   title: business.businessName,
                   url: window.location.href,
                 })
               } else {
                 navigator.clipboard.writeText(window.location.href)
                 alert("Link copied!")
               }
             }}
             className="w-12 h-12 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 transition-all shadow-lg"
           >
              <Share2 className="h-5 w-5" />
           </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-16 md:-mt-24 pb-8">
        <div className="bg-white rounded-[2.5rem] p-6 md:p-8 shadow-xl shadow-slate-200/40 border border-slate-100 flex flex-col items-center">
          {/* Circular Logo Overlap */}
          <div className="relative -mt-20 md:-mt-28 mb-4">
             <div className="w-28 h-28 md:w-40 md:h-40 rounded-full border-[6px] border-white bg-white overflow-hidden shadow-xl ring-1 ring-slate-100 transition-transform hover:scale-105 duration-500">
                {business.logo ? (
                  <img src={business.logo} alt={business.businessName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-800 text-3xl md:text-5xl font-black">
                    {business.businessName[0]}
                  </div>
                )}
             </div>
          </div>

          <div className="text-center space-y-1 mb-6">
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">{business.businessName}</h1>
            <p className="text-slate-400 font-bold uppercase tracking-[0.15em] text-[10px] md:text-xs">
              {business.category || "Premium Car Dealership"}
            </p>
          </div>

          {/* Stats Bar - Cleaner version like image */}
          <div className="w-full flex items-center justify-between border-t border-slate-50 pt-6 px-2 text-slate-900">
             <div className="flex-1 flex flex-col items-center border-r border-slate-100">
                <span className="text-lg md:text-xl font-black">{productCount}</span>
                <span className="text-slate-400 font-bold text-[9px] uppercase tracking-wider">Listings</span>
             </div>
             <div className="flex-1 flex flex-col items-center border-r border-slate-100">
                <span className="text-lg md:text-xl font-black flex items-center gap-1">
                  4.8 <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                </span>
                <span className="text-slate-400 font-bold text-[9px] uppercase tracking-wider">Rating</span>
             </div>
             <div className="flex-1 flex flex-col items-center">
                <span className="text-lg md:text-xl font-black">2.4K</span>
                <span className="text-slate-400 font-bold text-[9px] uppercase tracking-wider">Followers</span>
             </div>
          </div>

          {/* Inline Socials */}
          <div className="flex items-center gap-4">
             {business.socialLinks?.instagram && (
               <Link href={business.socialLinks.instagram} target="_blank" className="p-3 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
                  <Instagram className="h-6 w-6 text-[#E4405F]" />
               </Link>
             )}
             {business.socialLinks?.facebook && (
               <Link href={business.socialLinks.facebook} target="_blank" className="p-3 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
                  <Facebook className="h-6 w-6 text-[#1877F2]" />
               </Link>
             )}
             {business.phone && (
               <Link href={`tel:${business.phone}`} className="p-3 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
                  <Phone className="h-6 w-6 text-slate-700" />
               </Link>
             )}
          </div>
        </div>
      </div>
    </header>
  )
}
