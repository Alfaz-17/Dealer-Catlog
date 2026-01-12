import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Link from "next/link"
import { MessageCircle, Phone, ArrowLeft } from "lucide-react"
import { connectDB } from "@/lib/db"
import Business from "@/models/Business"
import Product from "@/models/Product"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"
import { ShareButton } from "@/components/products/share-button"

export async function generateMetadata({ params }: { params: Promise<{ businessSlug: string; productId: string }> }): Promise<Metadata> {
  const { productId } = await params
  
  await connectDB()
  const product = await Product.findById(productId)
    .select('name description price images')
    .lean()

  if (!product) {
    return { title: "Product Not Found" }
  }

  const primaryImage = product.images.find((img: any) => img.isPrimary) || product.images[0]

  return {
    title: `${product.name} - Product Details`,
    description: product.description || `Buy ${product.name} for ${formatPrice(product.price)}`,
    openGraph: {
      title: product.name,
      description: product.description || `Buy ${product.name}`,
      images: primaryImage ? [primaryImage.url] : [],
    },
  }
}

// Enable ISR - regenerate every 60 seconds
export const revalidate = 60

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ businessSlug: string; productId: string }>
}) {
  const { businessSlug, productId } = await params
  
  await connectDB()

  const business = await Business.findOne({ slug: businessSlug })
    .select('businessName phone whatsapp')
    .lean()
    
  if (!business) {
    notFound()
  }

  const product = await Product.findOne({
    _id: productId,
    businessId: business._id,
  })
    .select('name description price category images specs')
    .lean()

  if (!product) {
    notFound()
  }

  const whatsappLink = business.whatsapp
    ? `https://wa.me/${business.whatsapp.replace(/[^\d]/g, '')}?text=Hi! I'm interested in ${encodeURIComponent(product.name)} listed at ${formatPrice(product.price)}`
    : null

  const primaryImage = product.images.find((img: any) => img.isPrimary) || product.images[0]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link
          href={`/store/${businessSlug}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to {business.businessName}
        </Link>

        <div className="grid md:grid-cols-2 gap-8 bg-white rounded-lg p-6 md:p-8">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden">
              {primaryImage && (
                <img
                  src={primaryImage.url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image: any, index: number) => (
                  <div
                    key={index}
                    className="aspect-square bg-gray-100 rounded-md overflow-hidden"
                  >
                    <img
                      src={image.url}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              {product.category && (
                <Badge variant="secondary" className="mb-4">
                  {product.category}
                </Badge>
              )}
              <p className="text-4xl font-bold text-primary">
                {formatPrice(product.price)}
              </p>
            </div>

            {product.description && (
              <div>
                <h2 className="font-semibold mb-2">Description</h2>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {product.description}
                </p>
              </div>
            )}

            {product.specs && Object.keys(product.specs).length > 0 && (
              <div>
                <h2 className="font-semibold mb-2">Specifications</h2>
                <div className="space-y-2">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">{key}</span>
                      <span className="font-medium">{value as string}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3 pt-4">
              {whatsappLink && (
                <Link href={whatsappLink} target="_blank" className="block">
                  <Button className="w-full" size="lg">
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Inquire on WhatsApp
                  </Button>
                </Link>
              )}
              
              {business.phone && (
                <Link href={`tel:${business.phone}`} className="block">
                  <Button variant="outline" className="w-full" size="lg">
                    <Phone className="mr-2 h-5 w-5" />
                    Call Now
                  </Button>
                </Link>
              )}

              <ShareButton 
                productName={product.name}
                price={formatPrice(product.price)}
                url={`${process.env.NEXT_PUBLIC_APP_URL}/store/${businessSlug}/product/${productId}`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
