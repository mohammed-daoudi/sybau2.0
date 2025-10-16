import { useState } from 'react';
import { useReviews } from '@/hooks/useReviews';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Star } from 'lucide-react';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';
import ReviewFilters from './ReviewFilters';

interface ReviewSectionProps {
  productId: string;
}

export default function ReviewSection({ productId }: ReviewSectionProps) {
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [filters, setFilters] = useState({
    rating: undefined as number | undefined,
    verified: false,
    sort: '-createdAt',
  });

  const {
    reviews,
    isLoading,
    error,
    pagination,
    fetchReviews,
    submitReview,
    markHelpful,
  } = useReviews({ productId });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Customer Reviews</h2>
        {!isWritingReview && (
          <Button onClick={() => setIsWritingReview(true)}>Write a Review</Button>
        )}
      </div>

      {isWritingReview && (
        <Card className="p-6">
          <ReviewForm
            onSubmit={async (data) => {
              await submitReview(data);
              setIsWritingReview(false);
            }}
            onCancel={() => setIsWritingReview(false)}
          />
        </Card>
      )}

      <ReviewFilters
        filters={filters}
        onChange={(newFilters) => {
          setFilters(newFilters);
          fetchReviews({ page: 1, ...newFilters });
        }}
      />

      <ReviewList
        reviews={reviews}
        isLoading={isLoading}
        error={error}
        pagination={pagination}
        onPageChange={(page) => fetchReviews({ ...filters, page })}
        onMarkHelpful={markHelpful}
      />
    </div>
  );
}