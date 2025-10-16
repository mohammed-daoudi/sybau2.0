import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import Review from '@/models/Review';
import Product from '@/models/Product';
import User from '@/models/User';
import mongoose from 'mongoose';
import { sendReviewSubmittedEmail } from '@/lib/email-reviews';

// GET /api/reviews - Get reviews for a product
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sort = searchParams.get('sort') || '-createdAt'; // Default: newest first
    const rating = searchParams.get('rating');
    const verified = searchParams.get('verified');

    if (!productId || !mongoose.isValidObjectId(productId)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    await connectDB();

    // Build query
    const query: any = { 
      productId,
      status: 'approved'
    };
    
    if (rating) {
      query.rating = parseInt(rating);
    }
    
    if (verified === 'true') {
      query.purchaseVerified = true;
    }

    // Get total count for pagination
    const total = await Review.countDocuments(query);

    // Get reviews
    const reviews = await Review.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('userId', 'name profile.avatar')
      .lean();

    return NextResponse.json({
      reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      }
    });
  } catch (error) {
    console.error('Reviews GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

// POST /api/reviews - Create a new review
export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { productId, rating, title, content, images } = await req.json();

    if (!productId || !mongoose.isValidObjectId(productId)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Invalid rating' },
        { status: 400 }
      );
    }

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Get user and product details
    const [user, product] = await Promise.all([
      User.findById(session.user.id),
      Product.findById(productId),
    ]);

    if (!user || !product) {
      return NextResponse.json(
        { error: 'User or product not found' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user has already reviewed this product
    const existingReview = await Review.findOne({
      productId,
      userId: session.user.id,
    });

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this product' },
        { status: 400 }
      );
    }

    // Check if user has purchased the product
    // TODO: Implement purchase verification
    const purchaseVerified = false;

    // Create review
    const review = await Review.create({
      productId,
      userId: session.user.id,
      rating,
      title,
      content,
      images: images || [],
      purchaseVerified,
      status: 'pending', // Reviews need approval before being public
    });

    // Update product review stats
    await Product.findByIdAndUpdate(productId, {
      $inc: {
        'stats.reviews.total': 1,
        [`stats.reviews.distribution.${rating}`]: 1,
      },
      $set: {
        'stats.reviews.average': await calculateAverageRating(productId),
      },
    });

    // Send email notification
    await sendReviewSubmittedEmail(user, review.toObject(), product);

    return NextResponse.json({
      review,
      message: 'Review submitted successfully and is pending approval',
    });
  } catch (error) {
    console.error('Reviews POST error:', error);
    return NextResponse.json(
      { error: 'Failed to submit review' },
      { status: 500 }
    );
  }
}

// Helper function to calculate average rating
async function calculateAverageRating(productId: string): Promise<number> {
  const result = await Review.aggregate([
    { $match: { productId: new mongoose.Types.ObjectId(productId), status: 'approved' } },
    { 
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
      }
    }
  ]);

  return result[0]?.averageRating || 0;
}