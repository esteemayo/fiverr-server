import mongoose from 'mongoose';

const { Schema } = mongoose;

const gigSchema = new Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: [true, 'A gig must belong to a user'],
  },
  title: {
    type: String,
    required: [true, 'A gig must have a title'],
  },
  desc: {
    type: String,
    required: [true, 'A gig must have a description'],
  },
  totalStars: {
    type: Number,
    default: 0,
  },
  starNumber: {
    type: Number,
    default: 0,
  },
  category: {
    type: String,
    required: [true, 'A gig must belong to a category'],
  },
  price: {
    type: Number,
    required: [true, 'A gig must have a price'],
  },
  cover: {
    type: String,
    required: [true, 'A gig must have a cover image'],
  },
  images: {
    type: [String],
  },
  shortTitle: {
    type: String,
    required: [true, 'A gig must have a short title'],
  },
  shortDesc: {
    type: String,
    required: [true, 'A gig must have a short description'],
  },
  deliveryTime: {
    type: Number,
    required: [true, 'A gig must have a delivery time'],
  },
  revisionNumber: {
    type: Number,
    required: [true, 'A gig must have a revision number'],
  },
  features: {
    type: [String],
  },
  sales: {
    type: Number,
    default: 0,
  },
});

const Gig = mongoose.models.Gig || mongoose.model('Gig', gigSchema);

export default Gig;
