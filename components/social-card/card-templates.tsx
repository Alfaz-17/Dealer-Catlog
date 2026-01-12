import { formatPrice } from "@/lib/utils"

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

interface CardTemplateProps {
  product: Product
  business: Business
  template: "instagram-square" | "instagram-story" | "facebook-post"
}

export function InstagramSquareTemplate({ product, business }: { product: Product; business: Business }) {
  return (
    <div className="relative w-[1080px] h-[1080px] bg-white" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Background Image */}
      {product.images[0] && (
        <img 
          src={product.images[0].url}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover"
          crossOrigin="anonymous"
        />
      )}
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
      
      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-16 text-white">
        <h2 className="text-7xl font-bold mb-6 leading-tight">{product.name}</h2>
        <p className="text-6xl font-semibold mb-12">{formatPrice(product.price)}</p>
        
        <div className="flex justify-between items-end">
          <div>
            <p className="text-4xl font-semibold mb-2">{business.businessName}</p>
            {business.phone && (
              <p className="text-3xl opacity-90">{business.phone}</p>
            )}
          </div>
          {business.logo && (
            <div className="w-40 h-40 rounded-full bg-white p-3 flex items-center justify-center">
              <img 
                src={business.logo}
                alt={business.businessName}
                className="w-full h-full object-contain"
                crossOrigin="anonymous"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function InstagramStoryTemplate({ product, business }: { product: Product; business: Business }) {
  return (
    <div className="relative w-[1080px] h-[1920px] bg-white" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Top Logo */}
      <div className="absolute top-0 left-0 right-0 p-12 bg-gradient-to-b from-black/30 to-transparent z-10">
        {business.logo && (
          <div className="w-24 h-24 rounded-full bg-white p-2">
            <img 
              src={business.logo}
              alt={business.businessName}
              className="w-full h-full object-contain"
              crossOrigin="anonymous"
            />
          </div>
        )}
      </div>

      {/* Product Image */}
      {product.images[0] && (
        <div className="absolute inset-0 flex items-center justify-center">
          <img 
            src={product.images[0].url}
            alt={product.name}
            className="w-full h-full object-cover"
            crossOrigin="anonymous"
          />
        </div>
      )}

      {/* Bottom Info */}
      <div className="absolute bottom-0 left-0 right-0 p-16 bg-gradient-to-t from-black to-transparent text-white">
        <h2 className="text-6xl font-bold mb-4">{product.name}</h2>
        <p className="text-5xl font-semibold mb-6">{formatPrice(product.price)}</p>
        <p className="text-4xl opacity-90">{business.businessName}</p>
        {business.phone && (
          <p className="text-3xl opacity-80 mt-2">{business.phone}</p>
        )}
      </div>
    </div>
  )
}

export function FacebookPostTemplate({ product, business }: { product: Product; business: Business }) {
  return (
    <div className="w-[1200px] h-[630px] bg-white flex" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Left - Image */}
      <div className="w-[630px] h-full bg-gray-100">
        {product.images[0] && (
          <img 
            src={product.images[0].url}
            alt={product.name}
            className="w-full h-full object-cover"
            crossOrigin="anonymous"
          />
        )}
      </div>

      {/* Right - Details */}
      <div className="flex-1 p-12 flex flex-col justify-between" style={{ backgroundColor: business.brandColor || '#000000' }}>
        <div className="text-white">
          <h2 className="text-5xl font-bold mb-6 leading-tight">{product.name}</h2>
          <p className="text-4xl font-semibold">{formatPrice(product.price)}</p>
        </div>

        <div className="flex items-center justify-between text-white">
          <div>
            <p className="text-3xl font-semibold">{business.businessName}</p>
            {business.phone && (
              <p className="text-2xl opacity-90 mt-2">{business.phone}</p>
            )}
          </div>
          {business.logo && (
            <div className="w-32 h-32 rounded-full bg-white p-2">
              <img 
                src={business.logo}
                alt={business.businessName}
                className="w-full h-full object-contain"
                crossOrigin="anonymous"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function CardTemplates(props: CardTemplateProps) {
  switch (props.template) {
    case "instagram-square":
      return <InstagramSquareTemplate {...props} />
    case "instagram-story":
      return <InstagramStoryTemplate {...props} />
    case "facebook-post":
      return <FacebookPostTemplate {...props} />
    default:
      return <InstagramSquareTemplate {...props} />
  }
}
