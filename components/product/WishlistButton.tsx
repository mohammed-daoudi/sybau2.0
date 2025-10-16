import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useWishlist } from '@/hooks/useWishlist';
import { cn } from '@/lib/utils';

interface WishlistButtonProps {
  productId: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showText?: boolean;
  className?: string;
}

export function WishlistButton({
  productId,
  variant = 'ghost',
  size = 'icon',
  showText = false,
  className,
}: WishlistButtonProps) {
  const { toggleWishlistItem, isInWishlist, isLoading } = useWishlist();
  const isWishlisted = isInWishlist(productId);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent event bubbling if used in a card
    await toggleWishlistItem(productId);
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={cn(
        'group relative',
        isWishlisted && 'text-red-500 hover:text-red-600',
        className
      )}
      onClick={handleClick}
      disabled={isLoading}
    >
      <Heart
        className={cn(
          'h-5 w-5 transition-transform duration-200',
          isWishlisted ? 'fill-current' : 'group-hover:scale-110'
        )}
      />
      {showText && (
        <span className="ml-2">
          {isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        </span>
      )}
    </Button>
  );
}