'use client';

import { useWishlist } from '@/hooks/useWishlist';
import { ProductCard } from '@/components/product/ProductCard';
import { Button } from '@/components/ui/button';
import { LoginPrompt } from '@/components/auth/LoginPrompt';
import { useSession } from 'next-auth/react';
import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export function WishlistContent() {
  const { data: session } = useSession();
  const { wishlist, isLoading } = useWishlist();

  if (!session) {
    return <LoginPrompt message="Sign in to view your wishlist" />;
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-[400px] bg-gray-100 animate-pulse rounded-lg"
          />
        ))}
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-medium">Your wishlist is empty</h3>
        <p className="mt-2 text-gray-500">
          Find something you love and add it to your wishlist
        </p>
        <Button asChild className="mt-6">
          <Link href="/shop">Browse Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {wishlist.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          showWishlistButton
        />
      ))}
    </div>
  );
}