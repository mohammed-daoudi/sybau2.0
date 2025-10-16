import { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import type { Product } from '@/lib/types';

type WishlistProduct = Pick<Product, '_id' | 'title' | 'slug' | 'images' | 'price' | 'stock'>;

export function useWishlist() {
  const { data: session } = useSession();
  const [wishlist, setWishlist] = useState<WishlistProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch wishlist from API
  const fetchWishlist = useCallback(async () => {
    if (!session?.user) {
      setWishlist([]);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/wishlist');
      if (!response.ok) {
        throw new Error('Failed to fetch wishlist');
      }
      const data = await response.json();
      setWishlist(data.wishlist);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      toast.error('Failed to load wishlist');
    } finally {
      setIsLoading(false);
    }
  }, [session?.user]);

  // Toggle product in wishlist
  const toggleWishlistItem = useCallback(async (productId: string) => {
    if (!session?.user) {
      toast.error('Please sign in to manage your wishlist');
      return false;
    }

    try {
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      });

      if (!response.ok) {
        throw new Error('Failed to update wishlist');
      }

      const data = await response.json();
      toast.success(data.message);
      await fetchWishlist(); // Refresh wishlist
      return true;
    } catch (error) {
      console.error('Error updating wishlist:', error);
      toast.error('Failed to update wishlist');
      return false;
    }
  }, [session?.user, fetchWishlist]);

  // Check if a product is in the wishlist
  const isInWishlist = useCallback((productId: string) => {
    return wishlist.some(item => item._id === productId);
  }, [wishlist]);

  // Load wishlist on mount and when session changes
  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  return {
    wishlist,
    isLoading,
    toggleWishlistItem,
    isInWishlist,
    refetch: fetchWishlist,
  };
}