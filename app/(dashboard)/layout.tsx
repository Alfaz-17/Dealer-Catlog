import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { connectDB } from "@/lib/db"
import Business from "@/models/Business"
import { Sidebar } from "@/components/dashboard/sidebar"
import { MobileNav } from "@/components/dashboard/mobile-nav"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  await connectDB()
  const business = await Business.findOne({ userId: session.user.id }).lean()

  return (
    <div className="flex min-h-screen">
      <Sidebar 
        businessName={business?.businessName} 
        businessSlug={business?.slug}
      />
      
      <main className="flex-1 pb-20 md:pb-0">
        {children}
      </main>
      
      <MobileNav />
    </div>
  )
}
