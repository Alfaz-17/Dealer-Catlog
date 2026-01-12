"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SingleImageUpload } from "@/components/products/single-image-upload"
import { generateSlug } from "@/lib/utils"

export function RegisterForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    businessName: "",
    category: "",
    logo: "",
    banner: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Registration failed")
        setLoading(false)
        return
      }

      // Auto-login after registration
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        router.push("/login")
        return
      }

      router.push("/dashboard")
      router.refresh()
    } catch (error) {
      setError("Something went wrong. Please try again.")
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-2xl">Create Account</CardTitle>
        <CardDescription>
          Start showcasing your inventory today
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Personal Information</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                minLength={6}
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground">At least 6 characters</p>
            </div>
          </div>

          {/* Business Info */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-semibold text-lg">Business Information</h3>
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                type="text"
                placeholder="Luxury Auto Dealer"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                required
                disabled={loading}
              />
              {formData.businessName && (
                <p className="text-xs text-muted-foreground">
                  Your store: yourplatform.com/store/{generateSlug(formData.businessName)}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Business Category</Label>
              <Input
                id="category"
                type="text"
                placeholder="Auto Dealer, Furniture, Electronics..."
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                disabled={loading}
              />
            </div>
          </div>

          {/* Branding */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-semibold text-lg">Branding (Optional)</h3>
            <p className="text-sm text-muted-foreground">
              Add your logo and banner to make your store stand out
            </p>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <SingleImageUpload
                image={formData.logo}
                onChange={(url) => setFormData({ ...formData, logo: url })}
                onRemove={() => setFormData({ ...formData, logo: "" })}
                label="Logo"
                aspectRatio="aspect-square"
                endpoint="/api/public-upload"
              />
              
              <SingleImageUpload
                image={formData.banner}
                onChange={(url) => setFormData({ ...formData, banner: url })}
                onRemove={() => setFormData({ ...formData, banner: "" })}
                label="Banner Image"
                aspectRatio="aspect-video"
                endpoint="/api/public-upload"
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

