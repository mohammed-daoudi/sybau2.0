'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Eye } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { WishlistButton } from '@/components/product/WishlistButton';
import type { Product } from '@/lib/types';

type MinimalProduct = Pick<Product, '_id' | 'title' | 'slug' | 'images' | 'price' | 'stock'>;

interface ProductCardProps {
  product: MinimalProduct;
  showWishlistButton?: boolean;
}

export function ProductCard({ product, showWishlistButton = false }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { addItem } = useCart();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Fetch full product data before adding to cart
    try {
      const response = await fetch(`/api/products/${product._id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch product details');
      }
      const fullProduct = await response.json();
      addItem(fullProduct);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Implement quick view modal
    console.log('Quick view:', product.title);
  };

  return (
    <motion.div
      className="group relative"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/product/${product.slug}`}>
        <div className="product-card relative overflow-hidden">
          {/* Product image */}
          <div className="relative aspect-square mb-4 overflow-hidden rounded-lg bg-white/5">
            {!imageError && product.images[0] ? (
              <Image
                src={product.images[0]}
                alt={product.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                onError={() => setImageError(true)}
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyejFPjvT6VVlmQruj9TcMug/"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-brand-darkRed to-brand-crimson flex items-center justify-center">
                <span className="text-white/50 text-sm">No Image</span>
              </div>
            )}

            {/* Hover actions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              className="absolute inset-0 bg-black/40 flex items-center justify-center space-x-2"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleQuickView}
                className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
              >
                <Eye className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleAddToCart}
                className="p-2 bg-brand-auraRed backdrop-blur-sm rounded-full text-white hover:bg-brand-crimson transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
              </motion.button>
            </motion.div>

            {/* Stock indicator */}
            {product.stock <= 5 && product.stock > 0 && (
              <div className="absolute top-2 left-2 px-2 py-1 bg-orange-500/90 backdrop-blur-sm rounded text-white text-xs">
                Only {product.stock} left
              </div>
            )}
            
            {product.stock === 0 && (
              <div className="absolute top-2 left-2 px-2 py-1 bg-red-500/90 backdrop-blur-sm rounded text-white text-xs">
                Out of Stock
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="space-y-2">
            <h3 className="text-white font-semibold text-lg line-clamp-2 group-hover:text-brand-auraRed transition-colors">
              {product.title}
            </h3>

            <div className="flex items-center justify-between">
              <div className="text-xl font-bold text-white">
                ${product.price.toFixed(2)}
              </div>
              
              {showWishlistButton && (
                <WishlistButton productId={product._id} size="sm" />
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}