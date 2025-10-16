import mongoose from 'mongoose';
import { config } from 'dotenv';
import type { Product as ProductType, ProductCategory } from '@/lib/types';
import ProductModel from '@/models/Product';

// Load environment variables
config({ path: '.env.local' });

const sampleProducts: Partial<ProductType>[] = [
  {
    title: 'Crimson Aura Cap',
    slug: 'crimson-aura-cap',
    description: 'Premium streetwear cap with signature crimson gradient design. Features premium cotton construction and adjustable strap for perfect fit.',
    category: 'accessories',
    subcategory: 'hats',
    price: 49.99,
    currency: 'USD',
    images: [
      'https://images.pexels.com/photos/1082529/pexels-photo-1082529.jpeg',
      'https://images.pexels.com/photos/1154861/pexels-photo-1154861.jpeg',
    ],
    models: ['/models/crimson-cap.glb'],
    variants: [
      { name: 'Color', value: 'Crimson Red', price: 49.99, stock: 15, modelUrl: '/models/crimson-cap.glb' },
      { name: 'Color', value: 'Deep Black', price: 49.99, stock: 20, modelUrl: '/models/black-cap.glb' },
      { name: 'Color', value: 'Midnight Blue', price: 52.99, stock: 8, modelUrl: '/models/blue-cap.glb' },
    ],
    stock: 43,
    tags: ['premium', 'streetwear', 'caps', 'signature'],
    featured: true,
    status: 'published',
    seo: {
      title: 'Crimson Aura Cap - Premium Streetwear Headwear',
      description: 'Elevate your style with our signature Crimson Aura Cap. Premium cotton construction meets contemporary design.',
      keywords: ['streetwear cap', 'premium headwear', 'crimson cap', 'designer cap'],
    },
    stats: {
      views: 0,
      sales: 0,
    }
  },
  {
    title: 'Shadow Burst Hoodie',
    slug: 'shadow-burst-hoodie',
    description: 'Oversized cotton blend hoodie with our signature Shadow Burst print. Features premium French terry fabric and relaxed fit.',
    category: 'streetwear',
    subcategory: 'hoodies',
    price: 129.99,
    currency: 'USD',
    images: [
      'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg',
      'https://images.pexels.com/photos/1192601/pexels-photo-1192601.jpeg',
    ],
    models: ['/models/shadow-hoodie.glb'],
    variants: [
      { name: 'Size', value: 'S', stock: 10 },
      { name: 'Size', value: 'M', stock: 15 },
      { name: 'Size', value: 'L', stock: 20 },
      { name: 'Size', value: 'XL', stock: 12 },
      { name: 'Color', value: 'Black', modelUrl: '/models/shadow-hoodie-black.glb' },
      { name: 'Color', value: 'Grey', modelUrl: '/models/shadow-hoodie-grey.glb' },
    ],
    stock: 57,
    tags: ['premium', 'streetwear', 'hoodie', 'oversized', 'winter'],
    featured: true,
    status: 'published',
    seo: {
      title: 'Shadow Burst Hoodie - Premium Streetwear',
      description: 'Stay cozy in style with our signature Shadow Burst Hoodie. Premium French terry fabric meets contemporary design.',
      keywords: ['streetwear hoodie', 'premium hoodie', 'oversized hoodie', 'designer hoodie'],
    },
    stats: {
      views: 0,
      sales: 0,
    }
  },
  {
    title: 'Urban Eclipse Sneakers',
    slug: 'urban-eclipse-sneakers',
    description: 'Limited edition sneakers featuring our Urban Eclipse design. Premium leather construction with comfortable cushioning.',
    category: 'footwear',
    subcategory: 'sneakers',
    price: 189.99,
    currency: 'USD',
    images: [
      'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg',
      'https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg',
    ],
    models: ['/models/eclipse-sneakers.glb'],
    variants: [
      { name: 'Size', value: 'US 7', stock: 5 },
      { name: 'Size', value: 'US 8', stock: 8 },
      { name: 'Size', value: 'US 9', stock: 10 },
      { name: 'Size', value: 'US 10', stock: 12 },
      { name: 'Size', value: 'US 11', stock: 8 },
      { name: 'Size', value: 'US 12', stock: 5 },
    ],
    stock: 48,
    tags: ['premium', 'footwear', 'sneakers', 'limited edition'],
    featured: true,
    status: 'published',
    seo: {
      title: 'Urban Eclipse Sneakers - Limited Edition Footwear',
      description: 'Step out in style with our limited edition Urban Eclipse Sneakers. Premium leather meets innovative design.',
      keywords: ['limited edition sneakers', 'premium footwear', 'designer sneakers', 'urban sneakers'],
    },
    stats: {
      views: 0,
      sales: 0,
    }
  }
];

async function seedProducts() {
  try {
    // Connect to MongoDB
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in .env.local');
    }
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing products
    await ProductModel.deleteMany({});
    console.log('Cleared existing products');

    // Insert new products
    const result = await ProductModel.insertMany(sampleProducts);
    console.log(`✅ Successfully seeded ${result.length} products`);

    // Display inserted products
    const products = await ProductModel.find({}).select('title category price stock');
    console.log('\nSeeded products:');
    products.forEach((p: { title: string; category: ProductCategory; price: number; stock: number }) => {
      console.log(`- ${p.title} (${p.category}) - $${p.price} - ${p.stock} in stock`);
    });

  } catch (error) {
    console.error('❌ Error seeding products:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run seeding if this script is run directly
if (require.main === module) {
  seedProducts()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}