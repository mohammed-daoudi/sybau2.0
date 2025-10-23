import mongoose, { Schema, Document, Model } from 'mongoose';
import type { Product as ProductType, ProductVariant } from '@/lib/types';
import { mockDb } from '@/lib/mock-db';

const VariantSchema = new Schema({
  name: { type: String, required: true }, // e.g., "Color", "Size"
  value: { type: String, required: true }, // e.g., "Red", "Large"
  price: { type: Number }, // Optional price override
  stock: { type: Number }, // Optional stock override
  modelUrl: { type: String }, // Optional 3D model URL for this variant
});

interface ProductDocument extends Omit<ProductType, '_id'>, Document {}

const ProductSchema = new Schema<ProductDocument>({
  title: { 
    type: String, 
    required: [true, 'Product title is required'],
    trim: true,
    index: true,
  },
  slug: { 
    type: String, 
    required: [true, 'Product slug is required'],
    unique: true,
    lowercase: true,
    index: true,
  },
  description: { 
    type: String, 
    required: [true, 'Product description is required'],
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: ['streetwear', 'accessories', 'footwear', 'collections'],
    index: true,
  },
  subcategory: {
    type: String,
    enum: ['t-shirts', 'hoodies', 'pants', 'jackets', 'hats', 'bags', 'sneakers', 'jewelry', 'other'],
    index: true,
  },
  price: { 
    type: Number, 
    required: [true, 'Product price is required'],
    min: 0,
    index: true,
  },
  currency: { 
    type: String, 
    default: 'USD',
    enum: ['USD', 'EUR', 'GBP'],
  },
  images: [{ 
    type: String, 
    required: true,
    validate: {
      validator: function(v: string) {
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Image URL must be a valid URL'
    }
  }],
  models: [{ 
    type: String, // URLs to GLB/GLTF files
    validate: {
      validator: function(v: string) {
        return /^https?:\/\/.+\.(glb|gltf)$/.test(v);
      },
      message: 'Model URL must be a valid GLB/GLTF file URL'
    }
  }],
  variants: [VariantSchema],
  stock: { 
    type: Number, 
    required: true,
    min: 0,
    index: true,
    default: 0,
  },
  tags: [{ 
    type: String,
    trim: true,
    lowercase: true,
  }],
  featured: {
    type: Boolean,
    default: false,
    index: true,
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft',
    index: true,
  },
  seo: {
    title: String,
    description: String,
    keywords: [String],
  },
  stats: {
    views: { type: Number, default: 0 },
    sales: { type: Number, default: 0 },
    lastPurchased: Date,
    reviews: {
      total: { type: Number, default: 0 },
      average: { type: Number, default: 0 },
      distribution: {
        1: { type: Number, default: 0 },
        2: { type: Number, default: 0 },
        3: { type: Number, default: 0 },
        4: { type: Number, default: 0 },
        5: { type: Number, default: 0 },
      },
      verified: { type: Number, default: 0 },
    },
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Compound indexes for common queries
ProductSchema.index({ category: 1, subcategory: 1 });
ProductSchema.index({ status: 1, featured: 1 });
ProductSchema.index({ 'stats.views': -1 });
ProductSchema.index({ 'stats.sales': -1 });

// Generate slug from title if not provided
ProductSchema.pre('save', function(this: ProductDocument, next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
  next();
});

// Use mock database in development when MongoDB is not available
const USE_MOCK_DB = !process.env.MONGODB_URI || process.env.NODE_ENV === 'development';

let Product: any;

if (USE_MOCK_DB) {
  // Use mock database
  Product = {
    find: (query?: any) => mockDb.getModel('Product').find(query),
    findOne: (query: any) => mockDb.getModel('Product').findOne(query),
    findById: (id: string) => mockDb.getModel('Product').findById(id),
    create: (data: any) => mockDb.getModel('Product').create(data),
    countDocuments: (query?: any) => mockDb.getModel('Product').countDocuments(query),
    findByIdAndUpdate: async (id: string, update: any, options: any = {}) => {
      const model = mockDb.getModel('Product');
      const existingDoc = await model.findById(id);
      if (!existingDoc) return null;
      
      // Handle $set operator
      const updateData = update.$set || update;
      
      // Create a new object with updated fields
      const updatedDoc = {
        ...existingDoc.toObject(),
        ...updateData,
        updatedAt: new Date()
      };
      
      // Store the updated document
      await mockDb.removeDocument('Product', id);
      const result = await model.create({ ...updatedDoc, _id: id });
      
      return options.new !== false ? result : existingDoc;
    },
    findByIdAndDelete: async (id: string) => {
      const model = mockDb.getModel('Product');
      const doc = await model.findById(id);
      if (!doc) return null;
      mockDb.removeDocument('Product', id);
      return doc;
    }
  };
} else {
  // Use MongoDB
  Product = mongoose.models.Product || mongoose.model<ProductDocument>('Product', ProductSchema);
}

export default Product;
export type { ProductDocument };