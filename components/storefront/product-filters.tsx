"use client"

import { useState, useEffect } from "react"
import { X, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export interface FilterState {
  categories: string[]
  minPrice?: number
  maxPrice?: number
  sortBy: "newest" | "price-low" | "price-high"
}

interface ProductFiltersProps {
  categories: string[]
  onFilterChange: (filters: FilterState) => void
  isMobileOpen?: boolean
  onMobileClose?: () => void
}

export function ProductFilters({ 
  categories, 
  onFilterChange,
  isMobileOpen = false,
  onMobileClose
}: ProductFiltersProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [minPrice, setMinPrice] = useState<string>("")
  const [maxPrice, setMaxPrice] = useState<string>("")
  const [sortBy, setSortBy] = useState<FilterState["sortBy"]>("newest")

  useEffect(() => {
    onFilterChange({
      categories: selectedCategories,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      sortBy,
    })
  }, [selectedCategories, minPrice, maxPrice, sortBy, onFilterChange])

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    )
  }

  const clearAllFilters = () => {
    setSelectedCategories([])
    setMinPrice("")
    setMaxPrice("")
    setSortBy("newest")
  }

  const hasActiveFilters = 
    selectedCategories.length > 0 || minPrice || maxPrice || sortBy !== "newest"

  const FilterContent = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-50">
        <div className="flex items-center gap-3 text-slate-900">
          <SlidersHorizontal className="h-5 w-5" />
          <h3 className="font-extrabold text-xl tracking-tight">Filters</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-xs font-bold text-red-600 hover:text-red-700 transition-colors uppercase tracking-widest"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Sort By */}
      <div className="space-y-4">
        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Sort By</Label>
        <div className="grid grid-cols-1 gap-2">
          {[
            { value: "newest" as const, label: "Newest First" },
            { value: "price-low" as const, label: "Price: Low to High" },
            { value: "price-high" as const, label: "Price: High to Low" },
          ].map((option) => (
            <label
              key={option.value}
              className={cn(
                "flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer group",
                sortBy === option.value 
                  ? "bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-200" 
                  : "bg-white border-slate-100 text-slate-600 hover:bg-slate-50"
              )}
            >
              <span className="text-sm font-bold">{option.label}</span>
              <input
                type="radio"
                name="sortBy"
                value={option.value}
                checked={sortBy === option.value}
                onChange={(e) => setSortBy(e.target.value as FilterState["sortBy"])}
                className="sr-only"
              />
              {sortBy === option.value && (
                <div className="w-2 h-2 rounded-full bg-white" />
              )}
            </label>
          ))}
        </div>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div className="space-y-4">
          <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Categories</Label>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => toggleCategory(category)}
                className={cn(
                  "px-6 py-3 rounded-full text-xs font-bold transition-all border",
                  selectedCategories.includes(category)
                    ? "bg-slate-900 border-slate-900 text-white"
                    : "bg-white border-slate-100 text-slate-500 hover:bg-slate-50"
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Price Range */}
      <div className="space-y-4">
        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Price Range</Label>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase ml-1">Min Price</span>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
              <Input
                type="number"
                placeholder="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="pl-8 h-12 bg-slate-50 border-none rounded-xl font-bold focus-visible:ring-1 focus-visible:ring-slate-200"
              />
            </div>
          </div>
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase ml-1">Max Price</span>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
              <Input
                type="number"
                placeholder="Any"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="pl-8 h-12 bg-slate-50 border-none rounded-xl font-bold focus-visible:ring-1 focus-visible:ring-slate-200"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // Mobile Drawer
  if (isMobileOpen !== undefined) {
    return (
      <>
        {/* Backdrop */}
        {isMobileOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={onMobileClose}
          />
        )}

        {/* Drawer */}
        <div
          className={`fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl transition-transform duration-300 md:hidden ${
            isMobileOpen ? "translate-y-0" : "translate-y-full"
          }`}
          style={{ maxHeight: "80vh" }}
        >
          <div className="p-6 overflow-y-auto" style={{ maxHeight: "calc(80vh - 80px)" }}>
            <FilterContent />
          </div>
          <div className="p-4 border-t bg-white">
            <Button onClick={onMobileClose} className="w-full">
              Apply Filters
            </Button>
          </div>
        </div>
      </>
    )
  }

  // Desktop Sidebar
  return (
    <div className="hidden lg:block w-64 shrink-0">
      <div className="sticky top-20 bg-white rounded-lg border border-gray-200 p-6">
        <FilterContent />
      </div>
    </div>
  )
}
