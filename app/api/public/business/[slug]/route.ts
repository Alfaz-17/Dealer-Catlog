import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import Business from "@/models/Business"

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB()

    const business = await Business.findOne({ slug: params.slug }).lean()

    if (!business) {
      return NextResponse.json(
        { error: "Business not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(business)
  } catch (error: any) {
    console.error("Fetch business error:", error)
    return NextResponse.json(
      { error: "Failed to fetch business" },
      { status: 500 }
    )
  }
}
