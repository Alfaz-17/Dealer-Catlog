import { NextResponse } from "next/server"
import { uploadImage } from "@/lib/cloudinary"

export async function POST(request: Request) {
  try {
    // Public upload endpoint - no auth check required
    // TODO: Add rate limiting or other abuse prevention mechanisms

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const result = await uploadImage(file)

    return NextResponse.json(result)
  } catch (error: any) {
    console.error("Upload error:", error)
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    )
  }
}
