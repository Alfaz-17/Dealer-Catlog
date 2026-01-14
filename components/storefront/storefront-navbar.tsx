"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, MessageCircle, Share2, Phone, Box } from "lucide-react"
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
    { name: "Collection", href: `/store/${business.slug}` },
    { name: "About Us", href: `/store/${business.slug}/about` },
    { name: "Contact", href: `/store/${business.slug}/contact` },
  ]

  const isActive = (path: string) => pathname === path

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled ? "bg-white/95 backdrop-blur-md shadow-sm py-3" : "bg-white py-5"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between">
            
            {/* Left: Brand Identity */}
            <Link 
              href={`/store/${business.slug}`} 
              className="flex items-center gap-2"
            >
              {business.logo ? (
                <img
                  src={business.logo}
                  alt={business.businessName}
                  className="h-8 md:h-9 w-auto object-contain"
                />
              ) : (
                 <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-xl"
                  style={{ backgroundColor: business.brandColor || "#3b82f6" }}
                >
                  {business.businessName.charAt(0)}
                </div>
              )}
              <h1 className="font-extrabold text-lg md:text-xl tracking-tight text-slate-900">
                {business.businessName}
              </h1>
            </Link>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleShare}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-900 text-white shadow-lg active:scale-95 transition-all"
              >
                <Share2 className="h-5 w-5" />
              </button>

               <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 active:scale-95 transition-all"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div className={cn(
          "md:hidden absolute top-full left-4 right-4 bg-background/95 backdrop-blur-2xl border border-border rounded-3xl shadow-2xl transition-all duration-500 ease-in-out origin-top mt-4 overflow-hidden",
          isMobileMenuOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-4 pointer-events-none"
        )}>
          <div className="p-6 space-y-6">
             <div className="grid gap-2">
                {navLinks.map((link) => (
                   <Link
                     key={link.name}
                     href={link.href}
                     onClick={() => setIsMobileMenuOpen(false)}
                     className={cn(
                        "flex items-center justify-between px-6 h-16 rounded-2xl text-lg font-bold transition-all",
                        isActive(link.href)
                           ? "bg-foreground text-background"
                           : "text-muted-foreground hover:bg-muted hover:text-foreground"
                     )}
                   >
                      {link.name}
                   </Link>
                ))}
             </div>

             <div className="pt-4 border-t border-border space-y-4">
                {whatsappLink && (
                  <Link href={whatsappLink} target="_blank" className="block">
                    <Button 
                      className="w-full h-16 text-lg font-black rounded-2xl bg-blue-600 text-white hover:bg-blue-500 transition-all shadow-lg"
                    >
                      <MessageCircle className="mr-3 h-6 w-6" />
                      Direct Inquiry
                    </Button>
                  </Link>
                )}

                {business.phone && (
                   <Link href={`tel:${business.phone}`} className="block">
                    <Button variant="outline" className="w-full h-16 text-lg font-bold rounded-2xl glass border-border text-foreground">
                      <Phone className="mr-3 h-5 w-5" />
                      Contact Sales
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
