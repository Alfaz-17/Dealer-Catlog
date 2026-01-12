"use client"

import { useState, useEffect } from "react"
import { X, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5" />
          <h3 className="font-semibold text-lg">Filters</h3>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-xs"
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Sort By */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Sort By</Label>
        <div className="space-y-2">
          {[
            { value: "newest" as const, label: "Newest First" },
            { value: "price-low" as const, label: "Price: Low to High" },
            { value: "price-high" as const, label: "Price: High to Low" },
          ].map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
            >
              <input
                type="radio"
                name="sortBy"
                value={option.value}
                checked={sortBy === option.value}
                onChange={(e) => setSortBy(e.target.value as FilterState["sortBy"])}
                className="cursor-pointer"
              />
              <span className="text-sm">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div className="space-y-3">
          <Label className="text-sm font-semibold">Categories</Label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {categories.map((category) => (
              <label
                key={category}
                className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => toggleCategory(category)}
                  className="cursor-pointer"
                />
                <span className="text-sm">{category}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Price Range */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Price Range</Label>
        <div className="space-y-2">
          <div>
            <Label htmlFor="minPrice" className="text-xs text-muted-foreground">
              Min Price
            </Label>
            <Input
              id="minPrice"
              type="number"
              placeholder="₹ Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="maxPrice" className="text-xs text-muted-foreground">
              Max Price
            </Label>
            <Input
              id="maxPrice"
              type="number"
              placeholder="₹ Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
      </div>

      {/* Active Filters Summary */}
      {(selectedCategories.length > 0 || minPrice || maxPrice) && (
        <div className="pt-3 border-t space-y-2">
          <Label className="text-xs font-semibold text-muted-foreground">
            Active Filters
          </Label>
          <div className="flex flex-wrap gap-2">
            {selectedCategories.map((cat) => (
              <Badge
                key={cat}
                variant="secondary"
                className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => toggleCategory(cat)}
              >
                {cat}
                <X className="ml-1 h-3 w-3" />
              </Badge>
            ))}
            {(minPrice || maxPrice) && (
              <Badge
                variant="secondary"
                className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => {
                  setMinPrice("")
                  setMaxPrice("")
                }}
              >
                ₹{minPrice || "0"} - ₹{maxPrice || "∞"}
                <X className="ml-1 h-3 w-3" />
              </Badge>
            )}
          </div>
        </div>
      )}
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
