import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import User from '@/models/User';
import Product from '@/models/Product';
import mongoose from 'mongoose';

// GET /api/wishlist - Get user's wishlist
export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    
    const user = await User.findById(session.user.id)
      .populate('wishlist', 'title slug images price stock'); // Only get necessary fields
      
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ wishlist: user.wishlist });
  } catch (error) {
    console.error('Wishlist GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch wishlist' },
      { status: 500 }
    );
  }
}

// POST /api/wishlist - Add/remove product from wishlist
export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { productId } = await req.json();
    if (!productId || !mongoose.isValidObjectId(productId)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    await connectDB();
    
    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Toggle product in wishlist
    const wishlistIndex = user.wishlist.indexOf(productId);
    if (wishlistIndex === -1) {
      // Add to wishlist
      user.wishlist.push(productId);
    } else {
      // Remove from wishlist
      user.wishlist.splice(wishlistIndex, 1);
    }

    await user.save();

    return NextResponse.json({
      wishlist: user.wishlist,
      message: wishlistIndex === -1 ? 'Product added to wishlist' : 'Product removed from wishlist'
    });
  } catch (error) {
    console.error('Wishlist POST error:', error);
    return NextResponse.json(
      { error: 'Failed to update wishlist' },
      { status: 500 }
    );
  }
}