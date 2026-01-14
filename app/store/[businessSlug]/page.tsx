import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { connectDB } from "@/lib/db"
import Business from "@/models/Business"
import Product from "@/models/Product"
import { StorefrontNavbar } from "@/components/storefront/storefront-navbar"
import { StoreHeader } from "@/components/storefront/store-header"
import { ProductShowcase } from "@/components/storefront/product-showcase"
import { BusinessAboutSection } from "@/components/storefront/business-about-section"

export async function generateMetadata({ params }: { params: Promise<{ businessSlug: string }> }): Promise<Metadata> {
  const { businessSlug } = await params
  
  await connectDB()
  const business = await Business.findOne({ slug: businessSlug })
    .select('businessName description banner logo')
    .lean() as any

  if (!business) {
    return { title: "Business Not Found" }
  }

  return {
    title: `${business.businessName} - Products & Catalog`,
    description: business.description || `Browse products from ${business.businessName}`,
    openGraph: {
      title: business.businessName,
      description: business.description || `Browse products from ${business.businessName}`,
      images: business.banner ? [business.banner] : business.logo ? [business.logo] : [],
    },
  }
}

// Enable ISR - regenerate page every 60 seconds
export const revalidate = 60

export default async function StorePage({ params }: { params: Promise<{ businessSlug: string }> }) {
  const { businessSlug } = await params
  
  await connectDB()

  const business = await Business.findOne({ slug: businessSlug })
    .select('_id businessName slug logo banner description phone whatsapp email address category brandColor socialLinks createdAt')
    .lean() as any

  if (!business) {
    notFound()
  }

  const products = await Product.find({
    businessId: business._id,
    status: { $ne: "sold" },
  })
    .select('_id name price category images status createdAt')
    .sort({ createdAt: -1 })
    .limit(50) 
    .lean() as any[]

  const productCount = await Product.countDocuments({
    businessId: business._id,
  })

  // Serialize business data for Client Components
  const serializedBusiness = JSON.parse(JSON.stringify(business))

  return (
    <div className="min-h-screen bg-background">
      {/* Store Identity & Header */}
      <StoreHeader 
        business={serializedBusiness} 
        productCount={productCount}
      />
      
      <ProductShowcase 
        products={JSON.parse(JSON.stringify(products))} 
        businessSlug={serializedBusiness.slug}
        businessName={serializedBusiness.businessName}
        whatsappNumber={serializedBusiness.whatsapp}
        brandColor={serializedBusiness.brandColor}
      />

      {/* About Section */}
      <div className="max-w-7xl mx-auto px-4 py-12 bg-background/50">
        <BusinessAboutSection 
          business={serializedBusiness}
          productCount={productCount}
        />
      </div>
    </div>
  )
}

