import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import Review from '@/models/Review';
import Product from '@/models/Product';
import User from '@/models/User';
import mongoose from 'mongoose';
import { sendReviewHelpfulEmail } from '@/lib/email-reviews';

// POST /api/reviews/[reviewId]/helpful - Mark review as helpful/not helpful
export async function POST(
  req: Request,
  { params }: { params: { reviewId: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { reviewId } = params;
    if (!reviewId || !mongoose.isValidObjectId(reviewId)) {
      return NextResponse.json(
        { error: 'Invalid review ID' },
        { status: 400 }
      );
    }

    const { helpful } = await req.json();
    if (typeof helpful !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid helpful parameter' },
        { status: 400 }
      );
    }

    await connectDB();

    const review = await Review.findById(reviewId);
    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    // Remove user from both arrays first
    review.helpful = review.helpful.filter((id: mongoose.Types.ObjectId) => id.toString() !== session.user.id);
    review.notHelpful = review.notHelpful.filter((id: mongoose.Types.ObjectId) => id.toString() !== session.user.id);

    // Add user to the appropriate array
    if (helpful) {
      review.helpful.push(session.user.id);
    } else {
      review.notHelpful.push(session.user.id);
    }

    const previousHelpfulCount = review.helpful.length;
    await review.save();

    // If the review was marked as helpful and we've reached a milestone, send an email
    if (helpful && previousHelpfulCount < review.helpful.length) {
      // Get user and product details
      const [user, product] = await Promise.all([
        User.findById(review.userId),
        Product.findById(review.productId)
      ]);

      if (user && product) {
        await sendReviewHelpfulEmail(user, review.toObject(), product);
      }
    }

    return NextResponse.json({
      message: `Review marked as ${helpful ? 'helpful' : 'not helpful'}`,
      helpfulCount: review.helpful.length,
      notHelpfulCount: review.notHelpful.length,
      helpfulnessScore: review.helpfulnessScore,
    });
  } catch (error) {
    console.error('Review helpful POST error:', error);
    return NextResponse.json(
      { error: 'Failed to update review helpfulness' },
      { status: 500 }
    );
  }
}