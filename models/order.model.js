import mongoose from 'mongoose';

const { Schema } = mongoose;

const orderSchema = new Schema(
  {
    gig: {
      type: mongoose.Types.ObjectId,
      ref: 'Gig',
      required: [true, 'An order must belong to a gig'],
    },
    img: {
      type: String,
    },
    title: {
      type: String,
      required: [true, 'An order must have a title'],
    },
    price: {
      type: Number,
      required: [true, 'An order must have a price'],
    },
    sellerId: {
      type: String,
      required: [true, 'An order must have an image'],
    },
    buyerId: {
      type: String,
      required: [true, 'An order must have an image'],
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    payment_intent: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default Order;
