"use client"

import { Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ShareButtonProps {
  productName: string
  price: string
  url: string
}

export function ShareButton({ productName, price, url }: ShareButtonProps) {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: productName,
        text: `Check out ${productName} for ${price}`,
        url: url,
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(url)
      alert("Link copied to clipboard!")
    }
  }

  return (
    <Button
      variant="secondary"
      className="w-full"
      size="lg"
      onClick={handleShare}
    >
      <Share2 className="mr-2 h-5 w-5" />
      Share
    </Button>
  )
}
