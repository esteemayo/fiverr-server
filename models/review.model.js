import mongoose from 'mongoose';

const { Schema } = mongoose;

const reviewSchema = new Schema(
  {
    gig: {
      type: mongoose.Types.ObjectId,
      ref: 'Gig',
      required: [true, 'A review must belong to a gig'],
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'A review must belong to a user'],
    },
    star: {
      type: Number,
      min: [1, 'Star must not be below 1.0'],
      max: [5, 'Star must not be above 5.0'],
      enum: {
        values: [1, 2, 3, 4, 5],
        message: 'Stars can only be between 1 and 5',
      },
      required: [true, 'A review must have a star'],
    },
    desc: {
      type: String,
      required: [true, 'A review must have a description'],
    },
  },
  {
    timestamps: true,
  },
);

const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);

export default Review;
