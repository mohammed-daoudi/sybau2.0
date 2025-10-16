import { Product } from '@/lib/types';
import { uploadToCloudinary } from './cloudinary';

export async function uploadProductAssets({
  images,
  models,
}: {
  images: File[];
  models?: File[];
}) {
  // Upload product images
  const imageUploads = await Promise.all(
    images.map((image) =>
      uploadToCloudinary(image, {
        folder: 'products/images',
        resourceType: 'image',
        allowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [
          // Optimize images for web
          { quality: 'auto:best' },
          { fetch_format: 'auto' },
          // Create multiple sizes for responsive images
          { width: 800, crop: 'scale', aspect_ratio: '1.0' },
          { width: 400, crop: 'scale', aspect_ratio: '1.0' },
        ],
      })
    )
  );

  // Upload 3D models if provided
  const modelUploads = models
    ? await Promise.all(
        models.map((model) =>
          uploadToCloudinary(model, {
            folder: 'products/models',
            resourceType: 'auto',
            allowedFormats: ['glb', 'gltf'],
          })
        )
      )
    : [];

  return {
    images: imageUploads.map((img) => img.url),
    models: modelUploads.map((model) => model.url),
  };
}

export function generateProductSEO(product: Partial<Product>) {
  const description = product.description?.slice(0, 160) || '';
  
  return {
    title: product.title,
    description,
    keywords: product.tags?.join(', ') || '',
    openGraph: {
      title: product.title,
      description,
      images: product.images?.[0],
      type: 'product',
      price: {
        amount: product.price,
        currency: product.currency || 'USD',
      },
    },
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.title,
      description,
      image: product.images?.[0],
      offers: {
        '@type': 'Offer',
        price: product.price,
        priceCurrency: product.currency || 'USD',
        availability: product.stock && product.stock > 0 
          ? 'https://schema.org/InStock' 
          : 'https://schema.org/OutOfStock',
      },
    },
  };
}

export function validateProductData(data: Partial<Product>) {
  const errors: string[] = [];

  if (!data.title?.trim()) {
    errors.push('Product title is required');
  }

  if (!data.description?.trim()) {
    errors.push('Product description is required');
  }

  if (!data.price || data.price <= 0) {
    errors.push('Valid product price is required');
  }

  if (!data.images?.length) {
    errors.push('At least one product image is required');
  }

  if (!data.stock || data.stock < 0) {
    errors.push('Valid stock quantity is required');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}