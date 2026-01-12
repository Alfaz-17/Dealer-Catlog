"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Search, SlidersHorizontal, ChevronRight, MessageCircle, Eye, Filter, ArrowUpDown, Heart, ArrowRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { formatPrice } from "@/lib/utils"
import { cn } from "@/lib/utils"

interface Product {
  _id: string
  name: string
  price: number
  category?: string
  images: { url: string; isPrimary: boolean }[]
  status: string
  createdAt?: string | Date
}

interface ProductShowcaseProps {
  products: Product[]
  businessSlug: string
  businessName?: string
  whatsappNumber?: string
  brandColor?: string
}

export function ProductShowcase({ 
  products, 
  businessSlug,
  businessName = "Store",
  whatsappNumber,
  brandColor = "#000000"
}: ProductShowcaseProps) {
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<"newest" | "price-low" | "price-high">("newest")

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = products
      .map((p) => p.category)
      .filter((c): c is string => !!c)
    return Array.from(new Set(cats)).sort()
  }, [products])

  // Apply filters and search
  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      // Search filter
      if (search && !product.name.toLowerCase().includes(search.toLowerCase())) {
        return false
      }

      // Category filter
      if (activeCategory && product.category !== activeCategory) {
        return false
      }

      return true
    })

    // Sort
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        result.sort((a, b) => b.price - a.price)
        break
      case "newest":
      default:
        result.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
          return dateB - dateA
        })
    }

    return result
  }, [products, search, activeCategory, sortBy])

  const isNewProduct = (product: Product) => {
    if (!product.createdAt) return false
    const daysSinceCreated = (Date.now() - new Date(product.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    return daysSinceCreated <= 7
  }

  const handleWhatsAppInquiry = (e: React.MouseEvent, product: Product) => {
    e.preventDefault() 
    if (!whatsappNumber) return
    const message = `Hi! I'm interested in: ${product.name} - ${formatPrice(product.price)}`
    const url = `https://wa.me/${whatsappNumber.replace(/[^\d]/g, '')}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  return (
    <div className="bg-gray-50/50 min-h-screen pb-20">
      {/* Sticky Category Header for Mobile */}
      <div className="sticky top-16 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 py-3 mb-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 px-4 overflow-x-auto no-scrollbar pb-1">
            <Button
              variant={activeCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(null)}
              className="rounded-full shadow-sm shrink-0"
              style={activeCategory === null ? { backgroundColor: brandColor } : {}}
            >
              All Items
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={activeCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(cat)}
                className="rounded-full shadow-sm shrink-0"
                style={activeCategory === cat ? { backgroundColor: brandColor } : {}}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 space-y-6">
        
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search detailed inventory..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-11 bg-gray-50 border-transparent focus:bg-white focus:border-primary transition-all rounded-xl"
            />
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="flex-1 sm:flex-none gap-2 rounded-xl h-11">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                  <SheetDescription>Refine your search results</SheetDescription>
                </SheetHeader>
                <div className="py-6 space-y-6">
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm text-foreground">Sort By</h4>
                    <div className="grid grid-cols-1 gap-2">
                       <Button 
                        variant={sortBy === "newest" ? "default" : "outline"} 
                        onClick={() => setSortBy("newest")}
                        className="justify-start"
                        style={sortBy === "newest" ? { backgroundColor: brandColor } : {}}
                      >
                        Newest Arrivals
                      </Button>
                      <Button 
                        variant={sortBy === "price-low" ? "default" : "outline"} 
                        onClick={() => setSortBy("price-low")}
                         className="justify-start"
                         style={sortBy === "price-low" ? { backgroundColor: brandColor } : {}}
                      >
                        Price: Low to High
                      </Button>
                      <Button 
                        variant={sortBy === "price-high" ? "default" : "outline"} 
                        onClick={() => setSortBy("price-high")}
                         className="justify-start"
                         style={sortBy === "price-high" ? { backgroundColor: brandColor } : {}}
                      >
                        Price: High to Low
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Products Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
             <p className="text-sm font-medium text-gray-500">
                Found {filteredProducts.length} items
             </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
            {filteredProducts.map((product) => (
              <Link 
                href={`/store/${businessSlug}/product/${product._id}`} 
                key={product._id} 
                className="group block"
              >
                <div className="relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100/50">
                  {/* Image Container - Aspect 3:4 for premium look */}
                  <div className="aspect-[3/4] relative overflow-hidden bg-gray-100">
                     {product.images?.[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="w-full h-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-105"
                          loading="lazy"
                        />
                     ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300">
                           <ImageIcon className="h-10 w-10" />
                        </div>
                     )}
                     
                     {/* Overlay Gradient (subtle) */}
                     <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                     {/* Badges */}
                     <div className="absolute top-2 left-2 flex flex-col gap-1.5">
                        {/* New Arrival Logic (mock within 7 days) */}
                        {(new Date().getTime() - new Date(product.createdAt).getTime()) < 604800000 && (
                           <Badge className="bg-black/90 text-white backdrop-blur-md px-2.5 py-0.5 text-[10px] font-medium tracking-wide border-0 rounded-md shadow-sm">
                              NEW
                           </Badge>
                        )}
                        {/* Sold Badge */}
                        {product.status !== 'active' && (
                           <Badge variant="destructive" className="px-2.5 py-0.5 text-[10px] font-bold tracking-wide rounded-md shadow-sm">
                              SOLD
                           </Badge>
                        )}
                     </div>

                     {/* Wishlist Button (Visual) */}
                     <button className="absolute top-2 right-2 p-2 rounded-full bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white hover:text-red-500 transition-colors shadow-sm z-10">
                        <Heart className="h-4 w-4" />
                     </button>

                     {/* Quick Action Button (Desktop Hover) */}
                     <div className="absolute bottom-4 left-4 right-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 hidden md:block">
                        <Button className="w-full bg-white/90 backdrop-blur-md text-black hover:bg-white shadow-lg border-0 h-10 rounded-xl font-medium">
                           View Details
                        </Button>
                     </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-3 md:p-4 space-y-1.5">
                     <div className="flex justify-between items-start gap-2">
                        <h3 className="font-medium text-gray-900 leading-tight text-sm md:text-base line-clamp-2 min-h-[2.5em]">
                           {product.title}
                        </h3>
                     </div>
                     
                     <div className="flex items-center justify-between pt-1">
                        <div className="flex flex-col">
                           <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">{product.category || "General"}</span>
                           <span className="font-bold text-gray-900 text-base md:text-lg tracking-tight">
                              {formatPrice(product.price)}
                           </span>
                        </div>
                        {/* Mobile: Small Action Icon */}
                        <div className="md:hidden p-1.5 bg-gray-50 rounded-full text-gray-900">
                           <ArrowRight className="h-4 w-4" />
                        </div>
                     </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center px-4">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <Search className="h-10 w-10 text-gray-300" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No items found</h3>
              <p className="text-gray-500 max-w-sm mx-auto mb-8">
                We couldn't find any products matching your current filters. Try adjusting your search query.
              </p>
              <Button 
                onClick={() => {
                  setSearch("")
                  setActiveCategory("all")
                }}
                variant="outline"
                className="rounded-full px-8 h-12"
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

