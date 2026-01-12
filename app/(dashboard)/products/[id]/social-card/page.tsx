import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { connectDB } from "@/lib/db"
import Business from "@/models/Business"
import Product from "@/models/Product"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { LazyCardGenerator } from "@/components/social-card/lazy-card-generator"

export default async function SocialCardPage({ params }: { params: { id: string } }) {
  const session = await auth()

  if (!session?.user?.businessId) {
    redirect("/login")
  }

  await connectDB()

  const business = await Business.findById(session.user.businessId)
    .select('businessName logo phone brandColor')
    .lean() as any
  const product = await Product.findOne({
    _id: params.id,
    businessId: session.user.businessId,
  })
    .select('name price images')
    .lean() as any

  if (!product || !business) {
    redirect("/products")
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <Link
        href="/products"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Products
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">Generate Social Media Card</h1>
        <p className="text-muted-foreground mt-1">
          Create branded cards for {product.name} to share on social media
        </p>
      </div>

      <LazyCardGenerator
        product={{
          name: product.name,
          price: product.price,
          images: product.images,
        }}
        business={{
          businessName: business.businessName,
          logo: business.logo,
          phone: business.phone,
          brandColor: business.brandColor,
        }}
      />
    </div>
  )
}

    </div>
  )
}
