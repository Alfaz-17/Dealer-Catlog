import Link from "next/link"
import { RegisterForm } from "@/components/auth/register-form"

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">AutoCard Dealer Catalog</h1>
        <p className="text-gray-600">Create your business storefront today</p>
      </div>
      
      <RegisterForm />
      
      <p className="mt-4 text-sm text-gray-600">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:underline font-medium">
          Sign in
        </Link>
      </p>
    </div>
  )
}
