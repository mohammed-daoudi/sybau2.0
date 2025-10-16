import { Product } from '@/lib/types';

export const productSeeds: Partial<Product>[] = [
  {
    title: 'Urban Combat Hoodie',
    slug: 'urban-combat-hoodie',
    description: 'Premium heavyweight cotton blend hoodie with cyberpunk-inspired design elements. Features reflective panels and a unique digital camo pattern.',
    category: 'streetwear',
    subcategory: 'hoodies',
    price: 89.99,
    currency: 'USD',
    images: [
      'https://cdn.sybau.com/products/urban-combat-hoodie-main.jpg',
      'https://cdn.sybau.com/products/urban-combat-hoodie-detail.jpg',
      'https://cdn.sybau.com/products/urban-combat-hoodie-back.jpg',
    ],
    models: [
      'https://cdn.sybau.com/models/urban-combat-hoodie.glb',
    ],
    variants: [
      {
        name: 'Size',
        value: 'S',
        stock: 25,
      },
      {
        name: 'Size',
        value: 'M',
        stock: 40,
      },
      {
        name: 'Size',
        value: 'L',
        stock: 35,
      },
      {
        name: 'Size',
        value: 'XL',
        stock: 20,
      },
    ],
    stock: 120,
    tags: ['cyberpunk', 'streetwear', 'hoodie', 'urban', 'reflective'],
    featured: true,
    status: 'published',
    seo: {
      title: 'Urban Combat Hoodie - Cyberpunk Streetwear | SYBAU',
      description: 'Premium cyberpunk-inspired hoodie with reflective panels and digital camo pattern. Perfect for urban explorers.',
      keywords: ['cyberpunk hoodie', 'urban streetwear', 'reflective hoodie', 'digital camo'],
    },
  },
  {
    title: 'Neon Nights Jacket',
    slug: 'neon-nights-jacket',
    description: 'Weather-resistant jacket with LED-reactive trim and iridescent panels. Perfect for night riders and urban adventurers.',
    category: 'streetwear',
    subcategory: 'jackets',
    price: 149.99,
    currency: 'USD',
    images: [
      'https://cdn.sybau.com/products/neon-nights-jacket-main.jpg',
      'https://cdn.sybau.com/products/neon-nights-jacket-glow.jpg',
      'https://cdn.sybau.com/products/neon-nights-jacket-detail.jpg',
    ],
    models: [
      'https://cdn.sybau.com/models/neon-nights-jacket.glb',
    ],
    variants: [
      {
        name: 'Size',
        value: 'S',
        stock: 15,
      },
      {
        name: 'Size',
        value: 'M',
        stock: 25,
      },
      {
        name: 'Size',
        value: 'L',
        stock: 20,
      },
      {
        name: 'Size',
        value: 'XL',
        stock: 10,
      },
    ],
    stock: 70,
    tags: ['cyberpunk', 'jacket', 'led', 'reflective', 'weather-resistant'],
    featured: true,
    status: 'published',
    seo: {
      title: 'Neon Nights Jacket - LED-Reactive Streetwear | SYBAU',
      description: 'Weather-resistant jacket with LED-reactive trim. Stand out in the urban jungle.',
      keywords: ['led jacket', 'cyberpunk jacket', 'reflective jacket', 'urban fashion'],
    },
  },
  {
    title: 'Digital Drift Sneakers',
    slug: 'digital-drift-sneakers',
    description: 'High-tech sneakers with holographic accents and adaptive cushioning. Features our signature pixel pattern sole.',
    category: 'footwear',
    subcategory: 'sneakers',
    price: 129.99,
    currency: 'USD',
    images: [
      'https://cdn.sybau.com/products/digital-drift-sneakers-main.jpg',
      'https://cdn.sybau.com/products/digital-drift-sneakers-side.jpg',
      'https://cdn.sybau.com/products/digital-drift-sneakers-sole.jpg',
    ],
    models: [
      'https://cdn.sybau.com/models/digital-drift-sneakers.glb',
    ],
    variants: [
      {
        name: 'Size',
        value: '7',
        stock: 15,
      },
      {
        name: 'Size',
        value: '8',
        stock: 20,
      },
      {
        name: 'Size',
        value: '9',
        stock: 25,
      },
      {
        name: 'Size',
        value: '10',
        stock: 25,
      },
      {
        name: 'Size',
        value: '11',
        stock: 20,
      },
      {
        name: 'Size',
        value: '12',
        stock: 15,
      },
    ],
    stock: 120,
    tags: ['sneakers', 'footwear', 'holographic', 'cyberpunk', 'pixel'],
    featured: true,
    status: 'published',
    seo: {
      title: 'Digital Drift Sneakers - Holographic Footwear | SYBAU',
      description: 'High-tech sneakers with holographic accents and adaptive cushioning. Step into the future.',
      keywords: ['holographic sneakers', 'cyberpunk shoes', 'pixel sole', 'tech fashion'],
    },
  },
];

export async function seedProducts() {
  try {
    const Product = require('./Product').default;
    
    // Clear existing products
    await Product.deleteMany({});
    
    // Insert new products
    await Product.insertMany(productSeeds);
    
    console.log('Products seeded successfully');
  } catch (error) {
    console.error('Error seeding products:', error);
    throw error;
  }
}