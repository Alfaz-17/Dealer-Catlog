"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, SlidersHorizontal, Package, ArrowRight, Star } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn, formatPrice } from "@/lib/utils"

interface Product {
  _id: string
  name: string
  price: number
  category?: string
  images: { url: string }[]
  status: string
  createdAt?: string | Date
}

interface ProductShowcaseProps {
  products: Product[]
  businessSlug: string
  businessName: string
  whatsappNumber?: string
  brandColor?: string
}

export function ProductShowcase({ 
  products, 
  businessSlug, 
  businessName,
  whatsappNumber,
  brandColor 
}: ProductShowcaseProps) {
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean))) as string[]

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) ||
                         product.category?.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = !activeCategory || product.category === activeCategory
    return matchesSearch && matchesCategory
  })

  return (
    <section className="py-12 bg-[#F3F4F6] min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
           <div className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
              <Input
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-14 h-16 bg-white border-none rounded-2xl text-lg shadow-sm focus-visible:ring-1 focus-visible:ring-slate-200"
              />
           </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar mb-10 py-2">
          <button
            onClick={() => setActiveCategory(null)}
            className={cn(
              "rounded-full px-6 h-10 text-xs font-bold transition-all whitespace-nowrap",
              activeCategory === null 
                ? "bg-slate-900 text-white shadow-lg shadow-slate-200" 
                : "bg-white text-slate-500 border border-slate-100 hover:bg-slate-50"
            )}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "rounded-full px-6 h-10 text-xs font-bold transition-all whitespace-nowrap",
                activeCategory === cat 
                  ? "bg-slate-900 text-white shadow-lg shadow-slate-200" 
                  : "bg-white text-slate-500 border border-slate-100 hover:bg-slate-50"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-3 md:gap-6">
          <AnimatePresence mode='popLayout'>
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Link href={`/store/${businessSlug}/product/${product._id}`}>
                  <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group h-full">
                     {/* Product Image */}
                     <div className="aspect-[4/3] md:aspect-[16/10] relative overflow-hidden">
                        {product.images?.[0]?.url ? (
                          <img
                            src={product.images[0].url}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-50">
                            <Package className="h-8 w-8 text-slate-200" />
                          </div>
                        )}
                     </div>

                     {/* Product Info */}
                     <div className="p-3 md:p-8">
                        <div className="space-y-1">
                           <h3 className="text-sm md:text-2xl font-black text-slate-900 leading-tight truncate">
                             {product.name}
                           </h3>
                           <p className="text-sm md:text-2xl font-black text-slate-900">
                              {formatPrice(product.price)}
                           </p>
                           <div className="hidden md:flex items-center gap-2 text-[10px] text-slate-400 font-bold mt-2">
                              <span className="uppercase tracking-[0.15em]">{product.category || "Model"}</span>
                              <span className="h-1 w-1 rounded-full bg-slate-200" />
                              <span>2020</span>
                           </div>
                        </div>
                     </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredProducts.length === 0 && (
          <div className="py-20 text-center space-y-4">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
              <Search className="h-8 w-8 text-slate-200" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">No vehicles found</h3>
            <p className="text-slate-400">Try adjusting your filters or search keywords</p>
          </div>
        )}
      </div>
    </section>
  )
}
