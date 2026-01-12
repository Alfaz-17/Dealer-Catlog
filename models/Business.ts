import mongoose, { Schema, model, models, Document } from "mongoose";

export interface IBusiness extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  businessName: string;
  slug: string;
  logo?: string;
  banner?: string;
  description?: string;
  category?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  brandColor?: string;
  yearEstablished?: number;
  theme?: "modern" | "classic" | "minimal";
  plan?: "free" | "pro" | "enterprise";
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    website?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const BusinessSchema = new Schema<IBusiness>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    businessName: {
      type: String,
      required: [true, "Business name is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    logo: String,
    banner: String,
    description: String,
    category: String,
    phone: String,
    whatsapp: String,
    email: String,
    address: String,
    brandColor: {
      type: String,
      default: "#000000",
    },
    yearEstablished: {
      type: Number,
      min: 1900,
      max: new Date().getFullYear() + 1,
    },
    theme: {
      type: String,
      enum: ["modern", "classic", "minimal"],
      default: "modern",
    },
    plan: {
      type: String,
      enum: ["free", "pro", "enterprise"],
      default: "free",
    },
    socialLinks: {
      instagram: String,
      facebook: String,
      website: String,
    },
  },
  {
    timestamps: true,
  }
);

// Only add indexes that aren't already created by unique: true
BusinessSchema.index({ userId: 1 });
BusinessSchema.index({ category: 1 });

const Business = models?.Business || model<IBusiness>("Business", BusinessSchema);

export default Business;
