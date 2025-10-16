import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { connectDB } from '../lib/mongodb';
import { mockDb } from '../lib/mock-db';
import { uploadProductAssets } from '../lib/product-utils';

async function importProducts() {
  try {
    // Initialize mock database first
    await mockDb.connect();
    console.log('Connected to database');
    
    // Import Product model after database is connected
    const { default: Product } = await import('../models/Product');

    // Path to your product data CSV file
    const csvFilePath = path.join(__dirname, 'data', 'products.csv');
    // Path to your product images directory
    const imagesDir = path.join(__dirname, 'data', 'images');
    // Path to your 3D models directory
    const modelsDir = path.join(__dirname, 'data', '3d-models');

    const results: any[] = [];

    // Read CSV file
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        console.log(`Found ${results.length} products to import`);

        for (const row of results) {
          try {
            // Get image files for this product
            const images = row.imageFiles
              .split(',')
              .map((filename: string) => {
                const filePath = path.join(imagesDir, filename.trim());
                return fs.existsSync(filePath) ? fs.readFileSync(filePath) : null;
              })
              .filter(Boolean);

            // Get 3D model files
            const models = row.modelFiles
              ? row.modelFiles
                  .split(',')
                  .map((filename: string) => {
                    const filePath = path.join(modelsDir, filename.trim());
                    return fs.existsSync(filePath) ? fs.readFileSync(filePath) : null;
                  })
                  .filter(Boolean)
              : [];

                        // TEMPORARY: Skip asset upload during testing
            const imageUrls = images.map((_: any) => '/placeholder-image.jpg');
            const modelUrls = models.map((_: any) => '/placeholder-model.glb');

            // Create product data
            const slug = row.title
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)/g, '');

            const productData = {
              _id: `product_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
              title: row.title,
              description: row.description,
              slug: slug,
              price: parseFloat(row.price),
              currency: row.currency || 'USD',
              stock: parseInt(row.stock) || 0,
              tags: row.tags ? row.tags.split(',').map((tag: string) => tag.trim()) : [],
              images: imageUrls,
              models: modelUrls,
              createdAt: new Date(),
              updatedAt: new Date(),
            };

            // Create or update product in mock database
            try {
              const mockModel = mockDb.getModel('Product');
              const existingProduct = await mockModel.findOne({ slug });
              if (existingProduct) {
                Object.assign(existingProduct, productData);
                await existingProduct.save();
              } else {
                await mockModel.create(productData);
              }
            } catch (error) {
              console.error(`Error creating/updating product ${slug}:`, error);
              throw error;
            }
            console.log(`✅ Created product: ${productData.title}`);
          } catch (error: any) {
            console.error(`❌ Failed to create product from row:`, row);
            console.error(error.message);
          }
        }

        console.log('Import completed!');
        process.exit(0);
      });
  } catch (error: any) {
    console.error('Import failed:', error.message);
    process.exit(1);
  }
}

// Run the import
importProducts();