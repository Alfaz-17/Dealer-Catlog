"use client"

import { useState } from "react"
import { Download, Instagram, Facebook } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CardTemplates } from "./card-templates"

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

interface CardGeneratorProps {
  product: Product
  business: Business
}

const templates = [
  {
    id: "instagram-square",
    name: "Instagram Square",
    icon: Instagram,
    size: "1080 × 1080",
    description: "Perfect for Instagram posts",
  },
  {
    id: "instagram-story",
    name: "Instagram Story",
    icon: Instagram,
    size: "1080 × 1920",
    description: "Perfect for Instagram stories",
  },
  {
    id: "facebook-post",
    name: "Facebook Post",
    icon: Facebook,
    size: "1200 × 630",
    description: "Perfect for Facebook posts",
  },
] as const

type TemplateId = typeof templates[number]["id"]

export function CardGenerator({ product, business }: CardGeneratorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>("instagram-square")
  const [generating, setGenerating] = useState(false)

  const generateCard = async () => {
    setGenerating(true)

    try {
      // Dynamic imports - only load when needed
      const [{ default: html2canvas }, { default: confetti }] = await Promise.all([
        import("html2canvas"),
        import("canvas-confetti"),
      ])

      const element = document.getElementById("card-preview")
      
      if (!element) {
        throw new Error("Card preview not found")
      }

      const canvas = await html2canvas(element, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
        allowTaint: false,
        logging: false,
      })

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (!blob) return

        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        const fileName = `${business.businessName}-${product.name}-${selectedTemplate}.png`
          .toLowerCase()
          .replace(/[^a-z0-9-]/g, "-")
        
        link.download = fileName
        link.href = url
        link.click()
        URL.revokeObjectURL(url)

        // Success animation
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        })
      })
    } catch (error) {
      console.error("Failed to generate card:", error)
      alert("Failed to generate card. Please try again.")
    } finally {
      setGenerating(false)
    }
  }

  const selectedTemplateInfo = templates.find((t) => t.id === selectedTemplate)!

  return (
    <div className="space-y-6">
      {/* Template Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Select Template</CardTitle>
          <CardDescription>
            Choose the format that best suits your social media platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-3">
            {templates.map((template) => {
              const Icon = template.icon
              const isSelected = selectedTemplate === template.id

              return (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Icon className="h-6 w-6 mb-2" />
                  <h3 className="font-semibold text-sm">{template.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{template.size}</p>
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
          <CardDescription>
            This is how your card will look - {selectedTemplateInfo.size} pixels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-100 p-4 rounded-lg">
            <div 
              className="mx-auto"
              style={{
                maxWidth: selectedTemplate === "instagram-square" ? "400px" : 
                         selectedTemplate === "instagram-story" ? "225px" : "400px",
              }}
            >
              <div className="relative" style={{
                aspectRatio: selectedTemplate === "instagram-square" ? "1/1" : 
                            selectedTemplate === "instagram-story" ? "9/16" : "1200/630",
              }}>
                <div 
                  id="card-preview"
                  className="absolute inset-0"
                  style={{
                    transform: selectedTemplate === "instagram-square" ? "scale(0.37)" : 
                              selectedTemplate === "instagram-story" ? "scale(0.21)" : "scale(0.33)",
                    transformOrigin: "top left",
                  }}
                >
                  <CardTemplates
                    product={product}
                    business={business}
                    template={selectedTemplate}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Download Button */}
      <Button
        onClick={generateCard}
        disabled={generating}
        size="lg"
        className="w-full"
      >
        {generating ? (
          "Generating..."
        ) : (
          <>
            <Download className="mr-2 h-5 w-5" />
            Download Card
          </>
        )}
      </Button>

      <p className="text-sm text-center text-muted-foreground">
        💡 Tip: Share the downloaded card on your social media to showcase this product
      </p>
    </div>
  )
}
