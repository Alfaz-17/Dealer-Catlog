import dynamic from "next/dynamic"
import { Skeleton } from "@/components/ui/skeleton"

interface Product {
  name: string
  price: number
  images: { url: string }[]
}

interface Business {
  businessName: string
  logo?: string
  phone?: string
  brandColor?: string
}

interface LazyCardGeneratorProps {
  product: Product
  business: Business
}

// Lazy load the CardGenerator component with a loading skeleton
const CardGenerator = dynamic(
  () => import("./card-generator").then((mod) => ({ default: mod.CardGenerator })),
  {
    loading: () => (
      <div className="space-y-6">
        <Skeleton className="h-48 w-full rounded-lg" />
        <Skeleton className="h-96 w-full rounded-lg" />
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>
    ),
    ssr: false,
  }
)

export function LazyCardGenerator({ product, business }: LazyCardGeneratorProps) {
  return <CardGenerator product={product} business={business} />
}
