export type OrderStatus = 'processing' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';
export type UserRole = 'customer' | 'admin';
export type Currency = 'USD' | 'EUR' | 'GBP';

export interface UserPreferences {
  currency: Currency;
  notifications: {
    orderUpdates: boolean;
    promotions: boolean;
    newArrivals: boolean;
  };
  newsletter: boolean;
}

export interface UserProfile {
  avatar?: string;
  phoneNumber?: string;
  dateOfBirth?: Date;
  bio?: string;
  social?: {
    instagram?: string;
    twitter?: string;
  };
}

export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface Review {
  _id: string;
  productId: string;
  userId: string;
  rating: number;
  title: string;
  content: string;
  images?: string[];
  verified: boolean;
  helpful: string[]; // Array of User IDs
  notHelpful: string[]; // Array of User IDs
  status: ReviewStatus;
  purchaseVerified: boolean;
  helpfulnessScore?: number; // Virtual field
  createdAt: Date;
  updatedAt?: Date;
  author: {
    name: string;
    avatar?: string;
  };
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  addresses: Address[];
  wishlist: string[]; // Array of Product IDs
  preferences: UserPreferences;
  profile: UserProfile;
  isVerified: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt?: Date;
  fullName?: string; // Virtual field
}

export interface Address {
  _id?: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
}

export type ProductCategory = 'streetwear' | 'accessories' | 'footwear' | 'collections';
export type ProductSubcategory = 't-shirts' | 'hoodies' | 'pants' | 'jackets' | 'hats' | 'bags' | 'sneakers' | 'jewelry' | 'other';
export type ProductStatus = 'draft' | 'published' | 'archived';
export type Currency = 'USD' | 'EUR' | 'GBP';

export interface ProductSEO {
  title?: string;
  description?: string;
  keywords?: string[];
}

export interface ProductStats {
  views: number;
  sales: number;
  lastPurchased?: Date;
}

export interface Product {
  _id: string;
  title: string;
  slug: string;
  description: string;
  category: ProductCategory;
  subcategory?: ProductSubcategory;
  price: number;
  currency: Currency;
  images: string[];
  models: string[]; // URLs to GLB/GLTF files
  variants: ProductVariant[];
  stock: number;
  tags: string[];
  featured: boolean;
  status: ProductStatus;
  seo?: ProductSEO;
  stats: ProductStats;
  createdAt: Date;
  updatedAt?: Date;
}

export interface ProductVariant {
  _id?: string;
  name: string;
  value: string;
  price?: number; // Optional price override
  stock?: number; // Optional stock override
  modelUrl?: string; // Optional 3D model URL for this variant
}

export interface CartItem {
  productId: string;
  product: Product;
  variant?: ProductVariant;
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'canceled';
  shippingAddress: Address;
  tracking?: string;
  stripePaymentIntentId?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface OrderItem {
  productId: string;
  product?: Product;
  variant?: ProductVariant;
  quantity: number;
  price: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// 3D Model types for React Three Fiber
export interface Model3DProps {
  url: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
}

// Filter types for shop page
export interface ProductFilters {
  priceRange: [number, number];
  category: string;
  sortBy: string;
  tags?: string[];
}