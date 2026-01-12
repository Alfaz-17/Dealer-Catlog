import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import Product from "@/models/Product"

export async function GET(
  request: Request,
  { params }: { params: { businessId: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const category = searchParams.get("category")

    await connectDB()

    let query: any = {
      businessId: params.businessId,
      status: { $ne: "sold" }, // Don't show sold items by default
    }

    if (search) {
      query.name = { $regex: search, $options: "i" }
    }

    if (category) {
      query.category = category
    }

    const products = await Product.find(query).sort({ createdAt: -1 }).lean()

    return NextResponse.json(products)
  } catch (error: any) {
    console.error("Fetch products error:", error)
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    )
  }
}
