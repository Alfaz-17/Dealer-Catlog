"use client"

import { useState } from "react"
import { Upload, X, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SingleImageUploadProps {
  image?: string
  onChange: (url: string) => void
  onRemove: () => void
  label: string
  aspectRatio?: string
  endpoint?: string
}

export function SingleImageUpload({ 
  image, 
  onChange, 
  onRemove, 
  label,
  aspectRatio = "aspect-video",
  endpoint = "/api/upload"
}: SingleImageUploadProps) {
  const [uploading, setUploading] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const result = await response.json()
      onChange(result.url)
    } catch (error) {
      console.error("Upload error:", error)
      alert("Failed to upload image")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      
      {image ? (
        <div className={cn("relative group", aspectRatio, "w-full")}>
          <img
            src={image}
            alt={label}
            className="w-full h-full object-cover rounded-lg border"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
            <Button
              type="button"
              size="sm"
              variant="destructive"
              onClick={onRemove}
            >
              <X className="h-4 w-4 mr-2" />
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <label className={cn(
          aspectRatio,
          "w-full border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors",
          uploading && "opacity-50 cursor-not-allowed"
        )}>
          <Upload className="h-8 w-8 text-muted-foreground mb-2" />
          <span className="text-sm text-muted-foreground text-center px-4">
            {uploading ? "Uploading..." : `Click to upload ${label.toLowerCase()}`}
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </label>
      )}
    </div>
  )
}
