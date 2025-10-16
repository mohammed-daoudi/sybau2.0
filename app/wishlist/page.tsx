import { Metadata } from 'next';
import { WishlistContent } from '@/components/wishlist/WishlistContent';

export const metadata: Metadata = {
  title: 'Wishlist - SYBAU',
  description: 'Your saved items and favorite products',
};

export default function WishlistPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
      <WishlistContent />
    </div>
  );
}