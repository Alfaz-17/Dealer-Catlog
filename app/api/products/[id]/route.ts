import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { connectDB } from "@/lib/db"
import Product from "@/models/Product"
import { deleteImage } from "@/lib/cloudinary"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.businessId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const product = await Product.findOne({
      _id: params.id,
      businessId: session.user.businessId,
    }).lean()

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error: any) {
    console.error("Fetch product error:", error)
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.businessId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    await connectDB()

    const product = await Product.findOneAndUpdate(
      { _id: params.id, businessId: session.user.businessId },
      { $set: body },
      { new: true, runValidators: true }
    )

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error: any) {
    console.error("Update product error:", error)
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.businessId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const product = await Product.findOne({
      _id: params.id,
      businessId: session.user.businessId,
    })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Delete images from Cloudinary
    for (const image of product.images) {
      try {
        await deleteImage(image.publicId)
      } catch (error) {
        console.error("Failed to delete image:", image.publicId, error)
      }
    }

    await product.deleteOne()

    return NextResponse.json({ message: "Product deleted successfully" })
  } catch (error: any) {
    console.error("Delete product error:", error)
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    )
  }
}
