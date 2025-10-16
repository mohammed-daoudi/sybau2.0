import { useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import type { Review } from '@/lib/types';

interface ReviewsResponse {
  reviews: Review[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

interface UseReviewsParams {
  productId: string;
  initialData?: ReviewsResponse;
}

interface UseReviewsReturn {
  reviews: Review[];
  isLoading: boolean;
  error: Error | null;
  pagination: ReviewsResponse['pagination'];
  fetchReviews: (params: {
    page?: number;
    limit?: number;
    sort?: string;
    rating?: number;
    verified?: boolean;
  }) => Promise<void>;
  submitReview: (data: {
    rating: number;
    title: string;
    content: string;
    images?: string[];
  }) => Promise<void>;
  markHelpful: (reviewId: string, helpful: boolean) => Promise<void>;
}

export function useReviews({ productId, initialData }: UseReviewsParams): UseReviewsReturn {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>(initialData?.reviews || []);
  const [pagination, setPagination] = useState(initialData?.pagination || {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [isLoading, setIsLoading] = useState(!initialData);
  const [error, setError] = useState<Error | null>(null);

  const fetchReviews = useCallback(async ({
    page = 1,
    limit = 10,
    sort = '-createdAt',
    rating,
    verified,
  }: {
    page?: number;
    limit?: number;
    sort?: string;
    rating?: number;
    verified?: boolean;
  }) => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams({
        productId,
        page: page.toString(),
        limit: limit.toString(),
        sort,
        ...(rating && { rating: rating.toString() }),
        ...(verified && { verified: verified.toString() }),
      });

      const response = await fetch(`/api/reviews?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }

      const data: ReviewsResponse = await response.json();
      setReviews(data.reviews);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch reviews'));
      toast.error('Failed to load reviews');
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  const submitReview = useCallback(async (data: {
    rating: number;
    title: string;
    content: string;
    images?: string[];
  }) => {
    if (!session?.user) {
      toast.error('Please sign in to submit a review');
      return;
    }

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          ...data,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit review');
      }

      const result = await response.json();
      toast.success(result.message);
      
      // Refresh reviews after submission
      fetchReviews({ page: 1 });
    } catch (err) {
      console.error('Error submitting review:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to submit review');
    }
  }, [productId, session?.user, fetchReviews]);

  const markHelpful = useCallback(async (reviewId: string, helpful: boolean) => {
    if (!session?.user) {
      toast.error('Please sign in to mark reviews as helpful');
      return;
    }

    try {
      const response = await fetch(`/api/reviews/${reviewId}/helpful`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ helpful }),
      });

      if (!response.ok) {
        throw new Error('Failed to update review helpfulness');
      }

      const data = await response.json();
      
      // Update the review in the local state
      setReviews(prevReviews => 
        prevReviews.map(review => 
          review._id === reviewId
            ? {
                ...review,
                helpful: data.helpfulCount,
                notHelpful: data.notHelpfulCount,
                helpfulnessScore: data.helpfulnessScore,
              }
            : review
        )
      );

      toast.success(data.message);
    } catch (err) {
      console.error('Error marking review as helpful:', err);
      toast.error('Failed to update review helpfulness');
    }
  }, [session?.user]);

  return {
    reviews,
    isLoading,
    error,
    pagination,
    fetchReviews,
    submitReview,
    markHelpful,
  };
}