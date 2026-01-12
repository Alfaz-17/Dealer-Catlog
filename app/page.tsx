import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="text-center space-y-6 px-4">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
          AutoCard Dealer Catalog
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Create your own storefront and showcase your inventory to the world
        </p>
        <div className="flex gap-4 justify-center pt-4">
          <Link href="/register">
            <Button size="lg" className="text-lg px-8">
              Get Started Free
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="text-lg px-8">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
