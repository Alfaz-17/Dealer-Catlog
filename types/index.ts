export interface User {
  _id: string;
  email: string;
  name: string;
  password: string;
  role: "owner" | "admin";
  businessId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Business {
  _id: string;
  userId: string;
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

export interface ProductImage {
  url: string;
  publicId: string;
  isPrimary: boolean;
}

export interface Product {
  _id: string;
  businessId: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
  images: ProductImage[];
  status: "available" | "sold" | "out_of_stock";
  specs?: Record<string, any>;
  views: number;
  clicks: number;
  createdAt: Date;
  updatedAt: Date;
}
