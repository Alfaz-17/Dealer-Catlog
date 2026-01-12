import { auth, signOut } from "@/lib/auth"
import { redirect } from "next/navigation"
import { connectDB } from "@/lib/db"
import Business from "@/models/Business"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { BusinessEditForm } from "@/components/dashboard/business-edit-form"
import Link from "next/link"
import { ExternalLink } from "lucide-react"

export default async function SettingsPage() {
  const session = await auth()

  if (!session?.user?.businessId) {
    redirect("/login")
  }

  await connectDB()
  const business = await Business.findById(session.user.businessId)
    .select('_id businessName slug description category logo banner phone email whatsapp address brandColor yearEstablished socialLinks')
    .lean()

  if (!business) {
    redirect("/login")
  }

  // Serialize business data for Client Component
  const serializedBusiness = JSON.parse(JSON.stringify(business))

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Business Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your business profile and store appearance
        </p>
      </div>

      {/* Store Link */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Your Store</CardTitle>
          <CardDescription>
            Share this link with your customers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-muted-foreground">Store URL</p>
              <code className="text-sm font-mono bg-muted px-2 py-1 rounded truncate block">
                {process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/store/{business.slug}
              </code>
            </div>
            <Link 
              href={`/store/${business.slug}`}
              target="_blank"
              className="shrink-0"
            >
              <Button variant="outline" size="sm">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Store
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Business Edit Form */}
      <BusinessEditForm business={serializedBusiness} />

      {/* Account Actions */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>
            Manage your account settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            action={async () => {
              "use server"
              await signOut({ redirectTo: "/" })
            }}
          >
            <Button type="submit" variant="destructive">
              Sign Out
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

