import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { connectDB } from "@/lib/db"
import Business from "@/models/Business"
import Product from "@/models/Product"
import Link from "next/link"
import { Package, Eye, MousePointerClick, PlusCircle, Store } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StatsCard } from "@/components/dashboard/stats-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user?.businessId) {
    redirect("/login")
  }

  await connectDB()
  
  const business = await Business.findById(session.user.businessId).lean()
  const products = await Product.find({ businessId: session.user.businessId })
    .sort({ createdAt: -1 })
    .limit(5)
    .lean()

  // Calculate stats
  const totalProducts = await Product.countDocuments({ businessId: session.user.businessId })
  const totalViews = products.reduce((sum, p) => sum + (p.views || 0), 0)
  const totalClicks = products.reduce((sum, p) => sum + (p.clicks || 0), 0)

  return (
    <div className="p-4 md:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Welcome back!</h1>
        <p className="text-muted-foreground mt-1">
          Here's what's happening with your business
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard
          title="Total Products"
          value={totalProducts}
          icon={Package}
        />
        <StatsCard
          title="Total Views"
          value={totalViews}
          icon={Eye}
        />
        <StatsCard
          title="Total Clicks"
          value={totalClicks}
          icon={MousePointerClick}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">Add Your First Product</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Start showcasing your inventory to customers
            </p>
            <Link href="/products/add">
              <Button className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">View Your Store</h3>
            <p className="text-sm text-muted-foreground mb-4">
              See how customers see your business
            </p>
            <Link href={`/store/${business?.slug}`} target="_blank">
              <Button variant="outline" className="w-full">
                <Store className="mr-2 h-4 w-4" />
                Open Storefront
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Products */}
      {products.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Products</CardTitle>
            <CardDescription>Your latest added items</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {products.map((product) => (
                <div key={product._id.toString()} className="flex items-center gap-4 p-3 rounded-lg border">
                  {product.images?.[0] && (
                    <img
                      src={product.images[0].url}
                      alt={product.name}
                      className="h-16 w-16 rounded-md object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="font-medium">{product.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      ₹{product.price.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <Link href={`/products/${product._id}/edit`}>
                    <Button variant="outline" size="sm">Edit</Button>
                  </Link>
                </div>
              ))}
            </div>
            <Link href="/products">
              <Button variant="link" className="w-full mt-4">
                View All Products →
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
