"use client"

import { useState } from "react"
import Link from "next/link"
import { Edit, Trash2, Share2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"

interface Product {
  _id: string
  name: string
  price: number
  category?: string
  status: "available" | "sold" | "out_of_stock"
  images: { url: string; isPrimary: boolean }[]
}

interface ProductGridProps {
  products: Product[]
  onDelete: (id: string) => Promise<void>
}

const statusColors = {
  available: "default",
  sold: "secondary",
  out_of_stock: "destructive",
} as const

const statusLabels = {
  available: "Available",
  sold: "Sold",
  out_of_stock: "Out of Stock",
}

export function ProductGrid({ products, onDelete }: ProductGridProps) {
  const [deleting, setDeleting] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return
    }

    setDeleting(id)
    await onDelete(id)
    setDeleting(null)
  }

  if (products.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground">No products found</p>
        <Link href="/products/add">
          <Button className="mt-4">Add Your First Product</Button>
        </Link>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => {
        const primaryImage = product.images.find((img) => img.isPrimary) || product.images[0]

        return (
          <Card key={product._id} className="overflow-hidden group">
            <div className="aspect-square relative bg-gray-100">
              {primaryImage && (
                <img
                  src={primaryImage.url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute top-2 left-2">
                <Badge variant={statusColors[product.status]}>
                  {statusLabels[product.status]}
                </Badge>
              </div>
            </div>
            
            <div className="p-4 space-y-3">
              <div>
                <h3 className="font-semibold line-clamp-1">{product.name}</h3>
                <p className="text-lg font-bold text-primary mt-1">
                  {formatPrice(product.price)}
                </p>
                {product.category && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {product.category}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <Link href={`/products/${product._id}/edit`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(product._id)}
                  disabled={deleting === product._id}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Link href={`/products/${product._id}/social-card`}>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
