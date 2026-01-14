"use client"

import { Phone, Mail, CheckCircle2, MapPin, Globe, Instagram, Facebook } from "lucide-react"
import { motion } from "framer-motion"

interface Business {
  businessName: string
  description?: string
  phone?: string
  email?: string
  address?: string
  socialLinks?: {
    instagram?: string
    facebook?: string
    website?: string
  }
}

interface BusinessAboutSectionProps {
  business: Business
  productCount: number
}

export function BusinessAboutSection({ business, productCount }: BusinessAboutSectionProps) {
  return (
    <section className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100 overflow-hidden relative">
      {/* Subtle Background Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 blur-3xl opacity-50" />
      
      <div className="max-w-3xl relative z-10">
        <div className="space-y-2 mb-8">
           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Our Story</span>
           <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">About {business.businessName}</h2>
        </div>
        
        <p className="text-slate-500 leading-relaxed mb-12 text-base md:text-lg font-medium">
          {business.description || `Welcome to ${business.businessName}. We are dedicated to providing the best automotive experience with a curated selection of premium vehicles and exceptional customer service.`}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {business.phone && (
            <div className="flex items-center gap-4 group p-4 rounded-2xl bg-slate-50 border border-transparent hover:border-slate-100 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-slate-600 shadow-sm transition-transform group-hover:scale-105">
                <Phone className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Phone</span>
                <span className="text-base font-bold text-slate-900">{business.phone}</span>
              </div>
            </div>
          )}

          {business.email && (
            <div className="flex items-center gap-4 group p-4 rounded-2xl bg-slate-50 border border-transparent hover:border-slate-100 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-slate-600 shadow-sm transition-transform group-hover:scale-105">
                <Mail className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email</span>
                <span className="text-base font-bold text-slate-900 transition-colors group-hover:text-blue-600">{business.email}</span>
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 group p-4 rounded-2xl bg-green-50/30 border border-green-50 hover:bg-green-50 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-green-600 shadow-sm transition-transform group-hover:scale-105">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
                <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest text-opacity-70">Status</span>
                <span className="text-base font-bold text-slate-900">Certified Dealer</span>
            </div>
          </div>
        </div>

        {/* Social Links Row */}
        <div className="flex items-center gap-4 mt-12 pt-8 border-t border-slate-50">
           {business.socialLinks?.instagram && (
             <a href={business.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:text-[#E4405F] hover:bg-[#E4405F]/5 transition-all duration-300">
               <Instagram className="h-5 w-5" />
             </a>
           )}
           {business.socialLinks?.facebook && (
             <a href={business.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:text-[#1877F2] hover:bg-[#1877F2]/5 transition-all duration-300">
               <Facebook className="h-5 w-5" />
             </a>
           )}
           {business.socialLinks?.website && (
             <a href={business.socialLinks.website} target="_blank" rel="noopener noreferrer" className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all duration-300">
               <Globe className="h-5 w-5" />
             </a>
           )}
        </div>
      </div>
    </section>
  )
}
