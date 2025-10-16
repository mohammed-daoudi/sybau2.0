import fs from 'fs';
import path from 'path';
import { connectDB } from '../lib/mongodb';

async function testProducts() {
  try {
    await connectDB();
    console.log('Connected to database');

    // Import Product model after database is connected
    const { default: Product } = await import('../models/Product');

    // List all products
    const products = await Product.find({}).lean();
    console.log('\nProducts in database:', products.length, 'total');
    
    // Output products with more detail
    products.forEach((product: any) => {
      console.log(`\n${product.title}`);
      console.log(`Price: $${product.price}`);
      console.log(`Slug: ${product.slug || 'no slug'}`);
      console.log(`Tags: ${(product.tags || []).join(', ') || 'no tags'}`);
      console.log(`Images: ${(product.images || []).length}`);
      console.log(`Models: ${(product.models || []).length}`);
      console.log(`Created: ${product.createdAt}`);
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the test
testProducts();