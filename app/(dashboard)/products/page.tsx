"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Search, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ProductGrid } from "@/components/products/product-grid"
import { Pagination } from "@/components/ui/pagination"

export default function ProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    hasMore: false,
  })

  const fetchProducts = async (pageNum: number = page) => {
    try {
      const params = new URLSearchParams()
      if (search) params.append("search", search)
      params.append("page", pageNum.toString())
      params.append("limit", "20")

      const response = await fetch(`/api/products?${params}`)
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products || [])
        setPagination(data.pagination || { total: 0, totalPages: 0, hasMore: false })
      }
    } catch (error) {
      console.error("Failed to fetch products:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts(1)
  }, [])

  const handleSearch = () => {
    setPage(1)
    fetchProducts(1)
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    fetchProducts(newPage)
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setProducts(products.filter((p: any) => p._id !== id))
      } else {
        alert("Failed to delete product")
      }
    } catch (error) {
      console.error("Delete error:", error)
      alert("Failed to delete product")
    }
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground mt-1">
            Manage your inventory ({pagination.total} total)
          </p>
        </div>
        <Link href="/products/add">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            className="pl-9"
          />
        </div>
        <Button onClick={handleSearch}>Search</Button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      ) : (
        <>
          <ProductGrid products={products} onDelete={handleDelete} />
          <Pagination
            currentPage={page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
            hasMore={pagination.hasMore}
          />
        </>
      )}
    </div>
  )
}
