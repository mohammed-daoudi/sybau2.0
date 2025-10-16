import { ThumbsUp, ThumbsDown, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Star } from 'lucide-react';
import type { Review } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import ReviewPagination from './ReviewPagination';

interface ReviewListProps {
  reviews: Review[];
  isLoading: boolean;
  error: Error | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  onPageChange: (page: number) => void;
  onMarkHelpful: (reviewId: string, helpful: boolean) => Promise<void>;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((value) => (
        <Star
          key={value}
          className={value <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
          size={16}
        />
      ))}
    </div>
  );
}

export default function ReviewList({
  reviews,
  isLoading,
  error,
  pagination,
  onPageChange,
  onMarkHelpful,
}: ReviewListProps) {
  if (isLoading) {
    return <div className="text-center">Loading reviews...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        Failed to load reviews: {error.message}
      </div>
    );
  }

  if (reviews.length === 0) {
    return <div className="text-center">No reviews yet. Be the first to review!</div>;
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <Card key={review._id} className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <StarRating rating={review.rating} />
                <span className="font-semibold">{review.title}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                By {review.author.name} •{' '}
                {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                {review.verified && (
                  <span className="ml-2 inline-flex items-center text-green-600">
                    <Check size={16} className="mr-1" /> Verified Purchase
                  </span>
                )}
              </div>
            </div>
          </div>

          <p className="text-sm">{review.content}</p>

          {review.images?.length > 0 && (
            <div className="flex gap-2 mt-2">
              {review.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Review image ${index + 1}`}
                  className="w-20 h-20 object-cover rounded"
                />
              ))}
            </div>
          )}

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Was this review helpful?</span>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                className="gap-1"
                onClick={() => onMarkHelpful(review._id, true)}
              >
                <ThumbsUp size={16} />
                {review.helpful || 0}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="gap-1"
                onClick={() => onMarkHelpful(review._id, false)}
              >
                <ThumbsDown size={16} />
                {review.notHelpful || 0}
              </Button>
            </div>
          </div>
        </Card>
      ))}

      {pagination.pages > 1 && (
        <div className="mt-6">
          <ReviewPagination
            totalItems={pagination.total}
            pageSize={pagination.limit}
            currentPage={pagination.page}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}