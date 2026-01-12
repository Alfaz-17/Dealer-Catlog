import { notFound } from "next/navigation"
import { connectDB } from "@/lib/db"
import Business from "@/models/Business"
import { StorefrontNavbar } from "@/components/storefront/storefront-navbar"
import { StoreHeader } from "@/components/storefront/store-header"
import { MessageCircle, Mail, MapPin, Globe, Clock, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function ContactPage({ params }: { params: Promise<{ businessSlug: string }> }) {
  const { businessSlug } = await params
  
  await connectDB()
  const business = await Business.findOne({ slug: businessSlug })
    .select('_id businessName slug logo banner description phone whatsapp email address category brandColor socialLinks createdAt')
    .lean()

  if (!business) {
    notFound()
  }

  const serializedBusiness = JSON.parse(JSON.stringify(business))

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
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

       {/* Simple Header */}
       <div className="bg-white border-b pt-12 pb-8 px-4">
          <div className="max-w-4xl mx-auto text-center space-y-3">
             <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Contact Us</h1>
             <p className="text-gray-500 max-w-lg mx-auto">
               Have questions or interested in our inventory? We'd love to hear from you.
             </p>
          </div>
       </div>

       <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-12">
          <div className="grid md:grid-cols-2 gap-10">
             
             {/* Contact Methods */}
             <div className="space-y-8">
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
                   <h3 className="text-xl font-semibold">Get in Touch</h3>
                   
                   <div className="space-y-4">
                      {serializedBusiness.whatsapp && (
                        <a 
                          href={`https://wa.me/${serializedBusiness.whatsapp.replace(/[^\d]/g, '')}`} 
                          target="_blank"
                          className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-green-50 transition-colors group"
                        >
                           <div className="bg-white p-3 rounded-full shadow-sm group-hover:scale-110 transition-transform">
                              <MessageCircle className="h-6 w-6 text-green-600" />
                           </div>
                           <div>
                              <p className="text-sm font-medium text-gray-500">WhatsApp</p>
                              <p className="text-lg font-semibold text-gray-900 group-hover:text-green-700">Chat with us</p>
                           </div>
                           <ArrowRight className="ml-auto h-5 w-5 text-gray-300 group-hover:text-green-600" />
                        </a>
                      )}

                      {serializedBusiness.phone && (
                        <a 
                          href={`tel:${serializedBusiness.phone}`} 
                          className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-blue-50 transition-colors group"
                        >
                           <div className="bg-white p-3 rounded-full shadow-sm group-hover:scale-110 transition-transform">
                              <PhoneIcon className="h-6 w-6 text-blue-600" />
                           </div>
                           <div>
                              <p className="text-sm font-medium text-gray-500">Phone</p>
                              <p className="text-lg font-semibold text-gray-900 group-hover:text-blue-700">{serializedBusiness.phone}</p>
                           </div>
                             <ArrowRight className="ml-auto h-5 w-5 text-gray-300 group-hover:text-blue-600" />
                        </a>
                      )}

                       {serializedBusiness.email && (
                        <a 
                          href={`mailto:${serializedBusiness.email}`} 
                          className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-purple-50 transition-colors group"
                        >
                           <div className="bg-white p-3 rounded-full shadow-sm group-hover:scale-110 transition-transform">
                              <Mail className="h-6 w-6 text-purple-600" />
                           </div>
                           <div>
                              <p className="text-sm font-medium text-gray-500">Email</p>
                              <p className="text-lg font-semibold text-gray-900 group-hover:text-purple-700">{serializedBusiness.email}</p>
                           </div>
                             <ArrowRight className="ml-auto h-5 w-5 text-gray-300 group-hover:text-purple-600" />
                        </a>
                      )}
                   </div>
                </div>

                 {/* Socials */}
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
                   <h3 className="text-xl font-semibold">Follow Us</h3>
                   <div className="flex gap-4">
                      {serializedBusiness.socialLinks?.instagram && (
                         <Button asChild variant="outline" size="lg" className="rounded-full h-12 gap-2">
                           <a href={serializedBusiness.socialLinks.instagram} target="_blank">
                              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                              Instagram
                           </a>
                         </Button>
                      )}
                      {serializedBusiness.socialLinks?.facebook && (
                         <Button asChild variant="outline" size="lg" className="rounded-full h-12 gap-2">
                           <a href={serializedBusiness.socialLinks.facebook} target="_blank">
                              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                              Facebook
                           </a>
                         </Button>
                      )}
                      
                   </div>
                </div>
             </div>

             {/* Map / Location / Additional Info */}
             <div className="space-y-8">
                {serializedBusiness.address && (
                  <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm h-full">
                     <div className="flex items-center gap-3 mb-6">
                        <MapPin className="h-6 w-6 text-red-500" />
                        <h3 className="text-xl font-semibold">Visit Us</h3>
                     </div>
                     <p className="text-lg text-gray-700 leading-relaxed mb-6">
                        {serializedBusiness.address}
                     </p>
                     
                     {/* Google Maps Embed Placeholder - would typically require API key or iframe */}
                     <div className="aspect-video w-full bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400">
                        <div className="text-center">
                           <MapPin className="h-10 w-10 mx-auto mb-2 opacity-50" />
                           <span className="text-sm">Store Location</span>
                        </div>
                     </div>
                     
                     <div className="mt-6">
                        <Button className="w-full h-12 rounded-xl" asChild>
                           <a 
                              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(serializedBusiness.address)}`}
                              target="_blank"
                           >
                              Get Directions
                           </a>
                        </Button>
                     </div>
                  </div>
                )}
             </div>

          </div>
       </div>
    </div>
  )
}

function PhoneIcon({ className }: { className?: string }) {
   return (
      <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
         <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
      </svg>
   )
}
