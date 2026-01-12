"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Package, BarChart3, Settings, Store } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard", icon: Home, label: "Dashboard" },
  { href: "/products", icon: Package, label: "Products" },
  { href: "/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/settings", icon: Settings, label: "Settings" },
]

interface SidebarProps {
  businessName?: string
  businessSlug?: string
}

export function Sidebar({ businessName, businessSlug }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex md:flex-col md:w-64 bg-white border-r min-h-screen">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold">{businessName || "AutoCard"}</h2>
        {businessSlug && (
          <Link 
            href={`/store/${businessSlug}`}
            target="_blank"
            className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 mt-1"
          >
            <Store className="h-3 w-3" />
            View Store
          </Link>
        )}
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
