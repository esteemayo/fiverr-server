import { StatusCodes } from 'http-status-codes';
import asyncHandler from 'express-async-handler';

import Gig from '../models/gig.model.js';
import Order from '../models/order.model.js';

import { NotFoundError } from '../errors/notFound.js';

export const getOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find();

  res.status(StatusCodes.OK).json(orders);
});

export const getUserOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({
    ...(req.user.isSeller
      ? { sellerId: req.user.id }
      : { buyerId: req.user.id }),
  }).sort('-createdAt');

  res.status(StatusCodes.OK).json(orders);
});

export const createOrder = asyncHandler(async (req, res, next) => {
  const { gigId } = req.params;

  const gig = await Gig.findById(gigId);

  if (!gig) {
    return next(
      new NotFoundError(`There is no gig found with that ID → ${gigId}`),
    );
  }

  const newOrder = {
    gig: gig._id,
    img: gig.cover,
    title: gig.title,
    buyerId: req.user.id,
    sellerId: gig.user,
    price: gig.price,
    payment_intent: 'temporary',
  };

  const order = await Order.create({ ...newOrder });

  res.status(StatusCodes.CREATED).json(order);
});
