"use client"

import Image from "next/image"
import { optimizeCloudinaryImage, generateResponsiveSrcSet } from "@/lib/image-optimization"

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  quality?: number
  className?: string
  priority?: boolean
  sizes?: string
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  quality = 80,
  className = "",
  priority = false,
  sizes,
}: OptimizedImageProps) {
  // Only optimize Cloudinary images
  if (src && src.includes('cloudinary.com')) {
    const { src: optimizedSrc, srcSet, sizes: defaultSizes } = generateResponsiveSrcSet(src)
    
    return (
      <img
        src={optimizedSrc}
        srcSet={srcSet}
        sizes={sizes || defaultSizes}
        alt={alt}
        className={className}
        loading={priority ? "eager" : "lazy"}
      />
    )
  }

  // For non-Cloudinary images, use Next.js Image component
  if (width && height) {
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        quality={quality}
        className={className}
        priority={priority}
      />
    )
  }

  // Fallback to regular img tag
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={priority ? "eager" : "lazy"}
    />
  )
}
