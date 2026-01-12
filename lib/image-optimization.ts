/**
 * Cloudinary Image Optimization Helper
 * Transforms Cloudinary URLs with optimization parameters
 */

export function optimizeCloudinaryImage(url: string, options?: {
  width?: number
  height?: number
  quality?: number
  format?: 'auto' | 'webp' | 'avif'
}) {
  if (!url || !url.includes('cloudinary.com')) {
    return url
  }

  const { width, height, quality = 80, format = 'auto' } = options || {}

  // Build transformation string
  const transformations = [
    width && `w_${width}`,
    height && `h_${height}`,
    `q_${quality}`,
    `f_${format}`,
    'c_limit', // Don't upscale
  ].filter(Boolean).join(',')

  // Insert transformations into Cloudinary URL
  return url.replace('/upload/', `/upload/${transformations}/`)
}

/**
 * Generate responsive image srcset for Cloudinary images
 */
export function generateResponsiveSrcSet(url: string) {
  if (!url || !url.includes('cloudinary.com')) {
    return { src: url, srcSet: '' }
  }

  const sizes = [640, 750, 828, 1080, 1200, 1920]
  
  const srcSet = sizes
    .map(size => `${optimizeCloudinaryImage(url, { width: size, quality: 75 })} ${size}w`)
    .join(', ')

  return {
    src: optimizeCloudinaryImage(url, { width: 1080, quality: 80 }),
    srcSet,
    sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
  }
}
