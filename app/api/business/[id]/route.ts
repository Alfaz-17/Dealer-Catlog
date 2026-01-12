import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { connectDB } from "@/lib/db"
import Business from "@/models/Business"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user?.businessId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { id } = await params
    
    // Verify the user owns this business
    if (session.user.businessId !== id) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const {
      description,
      category,
      logo,
      banner,
      phone,
      email,
      whatsapp,
      address,
      brandColor,
      yearEstablished,
      socialLinks,
    } = body

    await connectDB()

    const updateData: any = {}
    
    // Only update fields that are provided
    if (description !== undefined) updateData.description = description
    if (category !== undefined) updateData.category = category
    if (logo !== undefined) updateData.logo = logo
    if (banner !== undefined) updateData.banner = banner
    if (phone !== undefined) updateData.phone = phone
    if (email !== undefined) updateData.email = email
    if (whatsapp !== undefined) updateData.whatsapp = whatsapp
    if (address !== undefined) updateData.address = address
    if (brandColor !== undefined) updateData.brandColor = brandColor
    if (yearEstablished !== undefined) updateData.yearEstablished = yearEstablished
    if (socialLinks !== undefined) updateData.socialLinks = socialLinks

    const business = await Business.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )

    if (!business) {
      return NextResponse.json(
        { error: "Business not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: "Business updated successfully",
      business,
    })
  } catch (error: any) {
    console.error("Business update error:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}
