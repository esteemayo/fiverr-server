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
      required: [true, 'An order must have a seller id'],
    },
    buyerId: {
      type: String,
      required: [true, 'An order must have a buyer id'],
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    payment_intent: {
      type: String,
      required: [true, 'An order must have a payment_intent id'],
    },
  },
  {
    timestamps: true,
  },
);

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default Order;
