import mongoose, { Schema, model, models, Document } from "mongoose";

export interface IProductImage {
  url: string;
  publicId: string;
  isPrimary: boolean;
}

export interface IProduct extends Document {
  _id: mongoose.Types.ObjectId;
  businessId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  price: number;
  category?: string;
  images: IProductImage[];
  status: "available" | "sold" | "out_of_stock";
  specs?: Record<string, any>;
  views: number;
  clicks: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductImageSchema = new Schema<IProductImage>({
  url: {
    type: String,
    required: true,
  },
  publicId: {
    type: String,
    required: true,
  },
  isPrimary: {
    type: Boolean,
    default: false,
  },
});



const ProductSchema = new Schema<IProduct>(
  {
    businessId: {
      type: Schema.Types.ObjectId,
      ref: "Business",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    description: String,
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0,
    },
    category: String,
    images: {
      type: [ProductImageSchema],
      validate: {
        validator: function (images: IProductImage[]) {
          return images.length <= 5;
        },
        message: "Maximum 5 images allowed per product",
      },
    },
    status: {
      type: String,
      enum: ["available", "sold", "out_of_stock"],
      default: "available",
    },
    specs: {
      type: Schema.Types.Mixed,
      default: {},
    },
    views: {
      type: Number,
      default: 0,
    },
    clicks: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
ProductSchema.index({ businessId: 1 });
ProductSchema.index({ status: 1 });
ProductSchema.index({ category: 1 });
ProductSchema.index({ createdAt: -1 });

const Product = models.Product || model<IProduct>("Product", ProductSchema);

export default Product;
