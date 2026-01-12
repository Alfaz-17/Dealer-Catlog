"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, MessageCircle, Share2, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Business {
  businessName: string
  logo?: string
  slug: string
  whatsapp?: string
  brandColor?: string
  phone?: string
}

interface StorefrontNavbarProps {
  business: Business
}

export function StorefrontNavbar({ business }: StorefrontNavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const whatsappLink = business.whatsapp 
    ? `https://wa.me/${business.whatsapp.replace(/[^\d]/g, '')}`
    : null

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: business.businessName,
          url: window.location.href,
        })
      } catch (err) {
        console.log("Error sharing:", err)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert("Link copied!")
    }
  }

  const navLinks = [
    { name: "Shop", href: `/store/${business.slug}` },
    { name: "About", href: `/store/${business.slug}/about` },
    { name: "Contact", href: `/store/${business.slug}/contact` },
  ]

  const isActive = (path: string) => pathname === path

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out",
          isScrolled 
            ? "bg-white/80 backdrop-blur-xl border-b border-black/5 py-3" 
            : "bg-transparent py-5"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-12 md:h-14">
            
            {/* Left: Brand Identity */}
            <Link 
              href={`/store/${business.slug}`} 
              className="flex items-center gap-3 group relative z-50 mr-8"
            >
              <div className={cn(
                "relative transition-all duration-500 ease-out overflow-hidden rounded-full shadow-sm ring-2 ring-white/20",
                isScrolled ? "w-8 h-8 md:w-9 md:h-9" : "w-10 h-10 md:w-11 md:h-11"
              )}>
                {business.logo ? (
                  <img
                    src={business.logo}
                    alt={business.businessName}
                    className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                   <div 
                    className="w-full h-full flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: business.brandColor || "#000" }}
                  >
                    {business.businessName.charAt(0)}
                  </div>
                )}
              </div>
              
              <div className={cn(
                "flex flex-col justify-center transition-all duration-300",
                !isScrolled && "text-white drop-shadow-md",
                isScrolled && "text-gray-900"
              )}>
                <h1 className={cn(
                  "font-bold leading-none tracking-tight transition-all duration-300",
                  isScrolled ? "text-base md:text-lg" : "text-lg md:text-xl"
                )}>
                  {business.businessName}
                </h1>
              </div>
            </Link>

            {/* Center: Desktop Navigation */}
            <div className="hidden md:flex items-center justify-center space-x-1 absolute left-1/2 -translate-x-1/2">
               {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={cn(
                       "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                       isActive(link.href) 
                          ? "bg-white text-black shadow-md" 
                          : isScrolled 
                             ? "text-gray-600 hover:text-black hover:bg-gray-100" 
                             : "text-white/80 hover:text-white hover:bg-white/10"
                    )}
                  >
                     {link.name}
                  </Link>
               ))}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 md:gap-4">
              
              {/* Desktop Contact Button */}
              <div className="hidden md:block">
                 {whatsappLink && (
                  <Link href={whatsappLink} target="_blank">
                    <Button 
                      size="sm"
                      className={cn(
                        "rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95",
                        isScrolled ? "h-9 px-5" : "h-10 px-6 backdrop-blur-md bg-white/20 text-white border border-white/20 hover:bg-white/30"
                      )}
                      style={isScrolled ? { backgroundColor: business.brandColor || "#000", color: 'white' } : {}}
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Chat
                    </Button>
                  </Link>
                 )}
              </div>

               <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleShare}
                className={cn(
                  "rounded-full transition-colors",
                  !isScrolled ? "text-white hover:bg-white/20" : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <Share2 className="h-5 w-5" />
              </Button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={cn(
                  "md:hidden p-2 rounded-full transition-colors",
                  !isScrolled ? "text-white hover:bg-white/20" : "text-gray-900 hover:bg-gray-100"
                )}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div className={cn(
          "md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-xl transition-all duration-300 ease-in-out origin-top",
          isMobileMenuOpen ? "opacity-100 scale-y-100 translate-y-0" : "opacity-0 scale-y-95 -translate-y-4 pointer-events-none"
        )}>
          <div className="px-4 py-6 space-y-4">
             {/* Mobile Navigation Links */}
             <div className="space-y-1 pb-4 border-b border-gray-100">
                {navLinks.map((link) => (
                   <Link
                     key={link.name}
                     href={link.href}
                     onClick={() => setIsMobileMenuOpen(false)}
                     className={cn(
                        "block px-4 py-3 rounded-xl text-base font-semibold transition-colors",
                        isActive(link.href)
                           ? "bg-gray-100 text-black"
                           : "text-gray-600 hover:bg-gray-50 hover:text-black"
                     )}
                   >
                      {link.name}
                   </Link>
                ))}
             </div>

             <div className="space-y-3 pt-2">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest pl-1">Get in Touch</h3>
                
                {whatsappLink && (
                  <Link href={whatsappLink} target="_blank" className="block">
                    <Button 
                      className="w-full justify-start h-12 text-base font-medium rounded-xl shadow-sm"
                      style={{ backgroundColor: business.brandColor || "#000" }}
                    >
                      <MessageCircle className="mr-3 h-5 w-5" />
                      WhatsApp Inquiry
                    </Button>
                  </Link>
                )}

                {business.phone && (
                   <Link href={`tel:${business.phone}`} className="block">
                    <Button variant="outline" className="w-full justify-start h-12 text-base font-medium rounded-xl border-gray-200">
                      <Phone className="mr-3 h-5 w-5" />
                      Phone Call
                    </Button>
                  </Link>
                )}
             </div>
          </div>
        </div>
      </nav>
    </>
  )
}
