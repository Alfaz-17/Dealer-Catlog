import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { connectDB } from "@/lib/db"
import Product from "@/models/Product"
import { ProductForm } from "@/components/products/product-form"

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const session = await auth()

  if (!session?.user?.businessId) {
    redirect("/login")
  }

  await connectDB()
  
  const product = await Product.findOne({
    _id: params.id,
    businessId: session.user.businessId,
  }).lean()

  if (!product) {
    redirect("/products")
  }

  // Convert MongoDB document to plain object
  const productData = {
    name: product.name,
    description: product.description || "",
    price: product.price,
    category: product.category || "",
    status: product.status,
    images: product.images,
    specs: product.specs || {},
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Edit Product</h1>
        <p className="text-muted-foreground mt-1">
          Update product details and images
        </p>
      </div>

      <ProductForm initialData={productData} productId={params.id} />
    </div>
  )
}
