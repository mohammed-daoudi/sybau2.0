import mongoose, { Schema, Document } from 'mongoose';
import type { Review as ReviewType } from '@/lib/types';

interface ReviewDocument extends Omit<ReviewType, '_id'>, Document {}

const ReviewSchema = new Schema<ReviewDocument>({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
    index: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000,
  },
  images: [{
    type: String,
    validate: {
      validator: function(v: string) {
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Image URL must be a valid URL'
    }
  }],
  verified: {
    type: Boolean,
    default: false,
  },
  helpful: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  notHelpful: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  purchaseVerified: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Indexes for common queries
ReviewSchema.index({ productId: 1, status: 1 });
ReviewSchema.index({ userId: 1, status: 1 });
ReviewSchema.index({ rating: 1 });
ReviewSchema.index({ createdAt: -1 });

// Virtual for helpfulness score
ReviewSchema.virtual('helpfulnessScore').get(function() {
  const total = this.helpful.length + this.notHelpful.length;
  if (total === 0) return 0;
  return (this.helpful.length / total) * 100;
});

const Review = mongoose.models.Review || mongoose.model<ReviewDocument>('Review', ReviewSchema);

export default Review;