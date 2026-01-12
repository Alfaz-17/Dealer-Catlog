import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { connectDB } from "@/lib/db"
import Product from "@/models/Product"

export async function GET(request: Request) {
  try {
    const session = await auth()
    
    if (!session?.user?.businessId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const category = searchParams.get("category")
    const status = searchParams.get("status")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")

    await connectDB()

    let query: any = { businessId: session.user.businessId }

    if (search) {
      query.name = { $regex: search, $options: "i" }
    }

    if (category) {
      query.category = category
    }

    if (status) {
      query.status = status
    }

    const skip = (page - 1) * limit

    // Get total count for pagination metadata
    const total = await Product.countDocuments(query)

    // Fetch products with field selection, pagination, and lean queries
    const products = await Product.find(query)
      .select('_id name price category images status createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page < Math.ceil(total / limit)
      }
    })
  } catch (error: any) {
    console.error("Fetch products error:", error)
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    
    if (!session?.user?.businessId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, price, category, images, specs, status } = body

    if (!name || price === undefined || !images || images.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    await connectDB()

    const product = await Product.create({
      businessId: session.user.businessId,
      name,
      description,
      price: Number(price),
      category,
      images,
      specs: specs || {},
      status: status || "available",
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error: any) {
    console.error("Create product error:", error)
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    )
  }
}
