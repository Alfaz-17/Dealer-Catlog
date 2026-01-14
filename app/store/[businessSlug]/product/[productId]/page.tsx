import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Link from "next/link"
import { 
  MessageCircle, 
  Phone, 
  ArrowLeft, 
  Share2, 
  Calendar, 
  Gauge, 
  Zap, 
  Fuel, 
  Cog,
  ChevronRight
} from "lucide-react"
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
    .select('businessName logo phone whatsapp slug')
    .lean() as any
    
  if (!business) {
    notFound()
  }

  const product = await Product.findOne({
    _id: productId,
    businessId: business._id,
  })
    .select('name description price category images specs createdAt')
    .lean() as any

  if (!product) {
    notFound()
  }

  const b = business as any
  const p = product as any

  const whatsappLink = b.whatsapp
    ? `https://wa.me/${b.whatsapp}?text=I'm interested in the ${p.name} for ${formatPrice(p.price)}`
    : null

  const images = p.images?.length > 0 ? p.images : [{ url: "/placeholder-car.jpg" }]
  const mainImage = images[0].url

  const specItems = [
    { label: "Year", value: p.specs?.year || "2020", icon: Calendar },
    { label: "Mileage", value: p.specs?.mileage || "25,000 km", icon: Package },
    { label: "Transmission", value: p.specs?.transmission || "Automatic", icon: Package },
    { label: "Fuel Type", value: p.specs?.fuelType || "Petrol", icon: Package },
    { label: "Engine", value: p.specs?.engineSize || "2.0L", icon: Package },
  ]

  return (
    <div className="min-h-screen bg-[#F3F4F6] pb-24">
      {/* Top Sticky Header */}
      <div className="bg-white/95 backdrop-blur-md px-4 h-20 flex items-center justify-between sticky top-0 z-50 border-b border-slate-100">
        <Link href={`/store/${businessSlug}`} className="p-2 -ml-2">
          <ArrowLeft className="h-6 w-6 text-slate-900" />
        </Link>
        
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Contact</span>
          <span className="font-extrabold text-sm text-slate-900">{business.businessName}</span>
        </div>
        
        <button className="p-2 -mr-2 text-slate-900">
          <Share2 className="h-6 w-6" />
        </button>
      </div>

      <div className="max-w-2xl mx-auto space-y-4 pt-4 px-4">
        {/* Hero Image */}
        <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100">
          <div className="aspect-video relative">
            {primaryImage ? (
              <img 
                src={primaryImage.url} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                <span className="text-slate-300">No Image</span>
              </div>
            )}
          </div>
          
          {/* Product Info */}
          <div className="p-6 md:p-8 space-y-4">
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-1">
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">{product.name}</h1>
                <p className="text-2xl md:text-3xl font-black text-slate-900">
                  {formatPrice(product.price)}
                </p>
              </div>
              <Badge className="bg-[#FEF3C7] text-[#92400E] hover:bg-[#FEF3C7] border-none px-4 py-2 rounded-xl font-bold whitespace-nowrap text-[10px] uppercase tracking-wide">
                 {product.category || "Luxury Sedan"}
              </Badge>
            </div>

            {product.description && (
              <p className="text-slate-500 text-sm md:text-base leading-relaxed">
                {product.description}
              </p>
            )}
          </div>
        </div>

        {/* Image Gallery (if multiple images) */}
        {thumbnails.length > 1 && (
          <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
            {thumbnails.map((image: any, index: number) => (
              <div key={index} className="flex-shrink-0 w-24 aspect-[4/3] rounded-xl overflow-hidden bg-white border border-slate-100 shadow-sm">
                <img
                  src={image.url}
                  alt={`${product.name} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {/* Specifications Card */}
        <div className="bg-white rounded-[16px] shadow-[0_4px_12px_rgba(0,0,0,0.06)] border border-slate-50 overflow-hidden">
           <div className="p-4 space-y-4">
              <h2 className="text-xl font-black text-slate-900">Specifications</h2>
              <div className="grid grid-cols-2 gap-3">
                 {specItems.map((item, i) => {
                   const Icon = item.icon
                   return (
                     <div 
                       key={i} 
                       className="flex items-center gap-3 p-3 h-[60px] rounded-[10px] bg-[#F9FAFB] border border-[#E5E7EB] transition-colors hover:bg-[#F3F4F6]"
                     >
                        <div className="flex-shrink-0 flex items-center justify-center">
                           <Icon className="h-[18px] w-[18px] text-[#6B7280]" />
                        </div>
                        <div className="flex flex-col justify-center min-w-0">
                           <span className="text-[12px] font-medium text-[#6B7280] leading-none mb-1 truncate">
                             {item.label}
                           </span>
                           <span className="text-[14px] font-bold text-[#111827] leading-tight truncate">
                             {item.value}
                           </span>
                        </div>
                     </div>
                   )
                 })}
              </div>
           </div>
        </div>

        {/* Contact Actions */}
        <div className="bg-white rounded-[2.5rem] p-6 md:p-8 shadow-sm border border-slate-100 space-y-4">
           <h3 className="text-lg font-black text-slate-900 text-center">Contact {business.businessName}</h3>
           
           {whatsappLink && (
              <Link href={whatsappLink} target="_blank" className="block">
                 <button className="w-full h-16 rounded-2xl bg-gradient-to-r from-[#25D366] to-[#14B8A6] text-white font-black text-lg flex items-center justify-between px-6 shadow-lg shadow-green-100 active:scale-[0.98] transition-all">
                    <div className="flex items-center gap-3">
                      <MessageCircle className="h-8 w-8" />
                      Chat on WhatsApp
                    </div>
                    <Phone className="h-6 w-6" />
                 </button>
              </Link>
           )}
           
           {business.phone && (
              <Link href={`tel:${business.phone}`} className="block">
                 <button className="w-full h-16 rounded-2xl bg-slate-900 text-white font-black text-lg flex items-center justify-between px-6 shadow-lg shadow-slate-100 active:scale-[0.98] transition-all">
                    <div className="flex items-center gap-3">
                       <Phone className="h-6 w-6 fill-white" />
                       Call Now
                    </div>
                    <span className="text-sm opacity-60 font-bold tracking-tight">{business.phone}</span>
                 </button>
              </Link>
           )}
        </div>
      </div>

      {/* Sticky Bottom Share Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-slate-100 z-50">
        <div className="max-w-2xl mx-auto">
          <button 
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: product.name,
                  url: window.location.href,
                })
              }
            }}
            className="w-full h-14 rounded-2xl bg-white border border-slate-200 text-slate-900 font-black text-lg flex items-center justify-center gap-3 active:scale-[0.98] transition-all shadow-sm"
          >
            <Share2 className="h-6 w-6" />
            Share
          </button>
        </div>
      </div>
    </div>
  )
}
