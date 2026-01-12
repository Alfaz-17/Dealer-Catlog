import { notFound } from "next/navigation"
import { connectDB } from "@/lib/db"
import Business from "@/models/Business"
import { StorefrontNavbar } from "@/components/storefront/storefront-navbar"
import { BadgeCheck, Calendar, MapPin, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function AboutPage({ params }: { params: Promise<{ businessSlug: string }> }) {
  const { businessSlug } = await params
  
  await connectDB()
  const business = await Business.findOne({ slug: businessSlug })
    .select('_id businessName slug logo banner description phone whatsapp email address category brandColor socialLinks createdAt')
    .lean()

  if (!business) {
    notFound()
  }

  const serializedBusiness = JSON.parse(JSON.stringify(business))
  const memberSince = business.createdAt 
    ? new Date(business.createdAt).getFullYear() 
    : new Date().getFullYear()

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col">
      <StorefrontNavbar 
        business={{
          businessName: serializedBusiness.businessName,
          logo: serializedBusiness.logo,
          slug: serializedBusiness.slug,
          whatsapp: serializedBusiness.whatsapp,
          brandColor: serializedBusiness.brandColor,
          phone: serializedBusiness.phone,
        }}
      />

      {/* Hero Section */}
      <div className="relative bg-white border-b">
         <div className="absolute inset-0 bg-gray-50 opacity-50" />
         <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24 flex flex-col items-center text-center">
             {serializedBusiness.logo && (
                 <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden shadow-xl border-4 border-white mb-8">
                     <img src={serializedBusiness.logo} alt={serializedBusiness.businessName} className="w-full h-full object-cover" />
                 </div>
             )}
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-6">
               About {serializedBusiness.businessName}
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-medium text-gray-500">
                {serializedBusiness.category && (
                   <span className="px-3 py-1 bg-gray-100 rounded-full text-gray-900">
                      {serializedBusiness.category}
                   </span>
                )}
                <span className="flex items-center gap-1">
                   <Calendar className="h-4 w-4" />
                   Since {memberSince}
                </span>
                <span className="flex items-center gap-1 text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                   <BadgeCheck className="h-4 w-4" />
                   Verified Seller
                </span>
            </div>
         </div>
      </div>

       <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-12 md:py-20">
           <div className="space-y-16">
               {/* Main Description */}
              <section className="prose prose-lg prose-gray max-w-none">
                 <p className="text-xl md:text-2xl leading-relaxed text-gray-600 font-light">
                    {serializedBusiness.description || "Welcome to our store. We are dedicated to providing the best products and service to our customers."}
                 </p>
              </section>

               {/* Stats or Features Grid (Placeholder for visual interest) */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center">
                      <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-600">
                         <BadgeCheck className="h-6 w-6" />
                      </div>
                      <h3 className="font-semibold text-lg mb-2">Quality Assured</h3>
                      <p className="text-gray-500 text-sm">We ensure every product meets our high standards.</p>
                  </div>
                  <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center">
                       <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-green-600">
                         <Globe className="h-6 w-6" />
                      </div>
                      <h3 className="font-semibold text-lg mb-2">Trusted Globally</h3>
                      <p className="text-gray-500 text-sm">Serving satisfied customers everywhere.</p>
                  </div>
                  <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center">
                       <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-purple-600">
                         <MapPin className="h-6 w-6" />
                      </div>
                      <h3 className="font-semibold text-lg mb-2">Easy Location</h3>
                      <p className="text-gray-500 text-sm">Visit our physical store easily.</p>
                  </div>
               </div>
           </div>
       </div>
    </div>
  )
}
