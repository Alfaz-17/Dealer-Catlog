import Link from "next/link"
import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">AutoCard Dealer Catalog</h1>
        <p className="text-gray-600">Sign in to manage your inventory</p>
      </div>
      
      <LoginForm />
      
      <p className="mt-4 text-sm text-gray-600">
        Don't have an account?{" "}
        <Link href="/register" className="text-primary hover:underline font-medium">
          Create one now
        </Link>
      </p>
    </div>
  )
}
