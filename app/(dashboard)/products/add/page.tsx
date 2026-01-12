import { ProductForm } from "@/components/products/product-form"

export default function AddProductPage() {
  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Add New Product</h1>
        <p className="text-muted-foreground mt-1">
          Create a new product listing for your store
        </p>
      </div>

      <ProductForm />
    </div>
  )
}
