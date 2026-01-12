"use client"

import { useState } from "react"
import { Upload, X, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ImageUploadProps {
  images: { url: string; publicId: string; isPrimary: boolean }[]
  onChange: (images: { url: string; publicId: string; isPrimary: boolean }[]) => void
  maxImages?: number
}

export function ImageUpload({ images, onChange, maxImages = 5 }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    if (images.length + files.length > maxImages) {
      alert(`Maximum ${maxImages} images allowed`)
      return
    }

    setUploading(true)

    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData()
        formData.append("file", file)

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          throw new Error("Upload failed")
        }

        return response.json()
      })

      const results = await Promise.all(uploadPromises)
      
      const newImages = results.map((result, index) => ({
        url: result.url,
        publicId: result.publicId,
        isPrimary: images.length === 0 && index === 0,
      }))

      onChange([...images, ...newImages])
    } catch (error) {
      console.error("Upload error:", error)
      alert("Failed to upload images")
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    // If removed primary and there are other images, make first one primary
    if (images[index].isPrimary && newImages.length > 0) {
      newImages[0].isPrimary = true
    }
    onChange(newImages)
  }

  const setPrimary = (index: number) => {
    const newImages = images.map((img, i) => ({
      ...img,
      isPrimary: i === index,
    }))
    onChange(newImages)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative group aspect-square">
            <img
              src={image.url}
              alt={`Product ${index + 1}`}
              className="w-full h-full object-cover rounded-lg border"
            />
            {image.isPrimary && (
              <div className="absolute top-2 left-2">
                <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                  Primary
                </span>
              </div>
            )}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
              {!image.isPrimary && (
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() => setPrimary(index)}
                  className="h-8 w-8 p-0"
                >
                  <ImageIcon className="h-4 w-4" />
                </Button>
              )}
              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={() => removeImage(index)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        
        {images.length < maxImages && (
          <label className={cn(
            "aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors",
            uploading && "opacity-50 cursor-not-allowed"
          )}>
            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
            <span className="text-sm text-muted-foreground">
              {uploading ? "Uploading..." : "Upload Image"}
            </span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              disabled={uploading}
              className="hidden"
            />
          </label>
        )}
      </div>
      
      <p className="text-sm text-muted-foreground">
        {images.length}/{maxImages} images • First image will be used as primary
      </p>
    </div>
  )
}
