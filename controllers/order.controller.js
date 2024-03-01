import { StatusCodes } from 'http-status-codes';
import Stripe from 'stripe';
import asyncHandler from 'express-async-handler';

import Gig from '../models/gig.model.js';
import Order from '../models/order.model.js';

import { NotFoundError } from '../errors/notFound.js';
import { ForbiddenError } from '../errors/forbidden.js';

import { APIFeatures } from './../utils/apiFeatures';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const getOrders = asyncHandler(async (req, res, next) => {
  const features = new APIFeatures(Order.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const orders = await features.query;

  res.status(StatusCodes.OK).json(orders);
});

export const getUserOrders = asyncHandler(async (req, res, next) => {
  const { isSeller, id: userId } = req.user;

  const orders = await Order.find({
    ...(isSeller ? { sellerId: userId } : { buyerId: userId }),
    isCompleted: true,
  }).sort('-createdAt');

  res.status(StatusCodes.OK).json(orders);
});

export const getOrder = asyncHandler(async (req, res, next) => {
  const { id: orderId } = req.params;

  const order = await Order.findById(orderId);

  if (!order) {
    return next(
      new NotFoundError(`There is no order found with that ID → ${orderId}`),
    );
  }

  if (
    order.sellerId === req.user.id ||
    order.buyerId === req.user.id ||
    req.user.role === 'admin'
  ) {
    res.status(StatusCodes.OK).json(order);
  }

  return next(new ForbiddenError('You can view only your order!'));
});

export const createPaymentIntent = asyncHandler(async (req, res, next) => {
  const { id: gigId } = req.params;

  const gig = await Gig.findById(gigId);

  if (!gig) {
    return next(
      new NotFoundError(`There is no gig found with that ID → ${gigId}`),
    );
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: gig.price * 100,
    currency: 'usd',
    automatic_payment_methods: {
      enabled: true,
    },
  });

  const newOrder = {
    gig: gig._id,
    img: gig.cover,
    title: gig.title,
    buyerId: req.user.id,
    sellerId: gig.user,
    price: gig.price,
    payment_intent: paymentIntent.id,
  };

  await Order.create({ ...newOrder });

  res.status(StatusCodes.OK).json({
    clientSecret: paymentIntent.client_secret,
  });
});

export const updateOrder = asyncHandler(async (req, res, next) => {
  const { id: orderId } = req.params;

  const order = await Order.findById(orderId);

  if (!order) {
    return next(
      new NotFoundError(`There is no order found with that ID → ${orderId}`),
    );
  }

  if (
    order.sellerId === req.user.id ||
    order.buyerId === req.user.id ||
    req.user.role === 'admin'
  ) {
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { $set: { ...req.body } },
      {
        new: true,
        runValidators: true,
      },
    );

    res.status(StatusCodes.OK).json(updatedOrder);
  }

  return next(new ForbiddenError('You can update only your order!'));
});

export const confirmOrder = asyncHandler(async (req, res, next) => {
  const { payment_intent } = req.body;

  const order = await Order.findOneAndUpdate(
    {
      payment_intent,
    },
    {
      $set: {
        isCompleted: true,
      },
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!order) {
    return next(
      new NotFoundError(
        `There is no order found with that paymentIntent → ${payment_intent}`,
      ),
    );
  }

  res.status(StatusCodes.OK).json(order);
});

export const deleteOrder = asyncHandler(async (req, res, next) => {
  const { id: orderId } = req.params;

  const order = await Order.findById(orderId);

  if (!order) {
    return next(
      new NotFoundError(`There is no order found with that ID → ${orderId}`),
    );
  }

  if (
    order.sellerId === req.user.id ||
    order.buyerId === req.user.id ||
    req.user.role === 'admin'
  ) {
    const updatedOrder = await Order.findByIdAndDelete(orderId);

    res.status(StatusCodes.OK).json(updatedOrder);
  }

  return next(new ForbiddenError('You can delete only your order!'));
});
