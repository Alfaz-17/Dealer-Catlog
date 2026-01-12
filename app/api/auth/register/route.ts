import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { connectDB } from "@/lib/db"
import User from "@/models/User"
import Business from "@/models/Business"
import { generateSlug } from "@/lib/utils"

export async function POST(request: Request) {
  try {
    const { name, email, password, businessName, category, logo, banner } = await request.json()

    // Validation
    if (!name || !email || !password || !businessName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      )
    }

    await connectDB()

    // Check if user exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      )
    }

    // Generate unique slug
    let slug = generateSlug(businessName)
    let slugExists = await Business.findOne({ slug })
    let counter = 1
    
    while (slugExists) {
      slug = `${generateSlug(businessName)}-${counter}`
      slugExists = await Business.findOne({ slug })
      counter++
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "owner",
    })

    // Create business with optional logo and banner
    const businessData: any = {
      userId: user._id,
      businessName,
      slug,
      category: category || "",
    }

    // Add logo and banner if provided
    if (logo) businessData.logo = logo
    if (banner) businessData.banner = banner

    const business = await Business.create(businessData)

    // Link business to user
    user.businessId = business._id
    await user.save()

    return NextResponse.json(
      { 
        message: "User created successfully",
        userId: user._id,
        businessId: business._id,
        slug: business.slug,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

