"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageUpload } from "@/components/products/image-upload"

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  price: z.number().min(0, "Price must be positive"),
  category: z.string().optional(),
  status: z.enum(["available", "sold", "out_of_stock"]).default("available"),
  specs: z.record(z.any()).optional(),
})

type ProductFormData = z.infer<typeof productSchema>

interface ProductFormProps {
  initialData?: ProductFormData &  { images?: { url: string; publicId: string; isPrimary: boolean }[] }
  productId?: string
}

export function ProductForm({ initialData, productId }: ProductFormProps) {
  const router = useRouter()
  const [images, setImages] = useState(initialData?.images || [])
  const [specs, setSpecs] = useState<Record<string, string>>(initialData?.specs || {})
  const [newSpec, setNewSpec] = useState({ key: "", value: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData,
  })

  const onSubmit = async (data: ProductFormData) => {
    if (images.length === 0) {
      setError("Please upload at least one image")
      return
    }

    setLoading(true)
    setError("")

    try {
      const url = productId ? `/api/products/${productId}` : "/api/products"
      const method = productId ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          price: Number(data.price),
          images,
          specs,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to save product")
      }

      router.push("/products")
      router.refresh()
    } catch (error: any) {
      setError(error.message)
      setLoading(false)
    }
  }

  const addSpec = () => {
    if (newSpec.key && newSpec.value) {
      setSpecs({ ...specs, [newSpec.key]: newSpec.value })
      setNewSpec({ key: "", value: "" })
    }
  }

  const removeSpec = (key: string) => {
    const newSpecs = { ...specs }
    delete newSpecs[key]
    setSpecs(newSpecs)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="BMW 5 Series 2023"
              disabled={loading}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price (₹) *</Label>
            <Input
              id="price"
              type="number"
              {...register("price", { valueAsNumber: true })}
              placeholder="4500000"
              disabled={loading}
            />
            {errors.price && (
              <p className="text-sm text-destructive">{errors.price.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              {...register("category")}
              placeholder="Sedan, SUV, Electronics..."
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Detailed product description..."
              rows={4}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              {...register("status")}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
              disabled={loading}
            >
              <option value="available">Available</option>
              <option value="sold">Sold</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Product Images *</CardTitle>
        </CardHeader>
        <CardContent>
          <ImageUpload images={images} onChange={setImages} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Specifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Key (e.g., Year)"
              value={newSpec.key}
              onChange={(e) => setNewSpec({ ...newSpec, key: e.target.value })}
              disabled={loading}
            />
            <Input
              placeholder="Value (e.g., 2023)"
              value={newSpec.value}
              onChange={(e) => setNewSpec({ ...newSpec, value: e.target.value })}
              disabled={loading}
            />
            <Button type="button" onClick={addSpec} disabled={loading}>
              Add
            </Button>
          </div>

          {Object.entries(specs).length > 0 && (
            <div className="space-y-2">
              {Object.entries(specs).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-2 border rounded">
                  <span className="text-sm">
                    <strong>{key}:</strong> {value}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSpec(key)}
                    disabled={loading}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={loading}
          className="flex-1"
        >
          {loading ? "Saving..." : productId ? "Update Product" : "Create Product"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
