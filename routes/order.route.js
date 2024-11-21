/* eslint-disable */

import express from 'express';

import * as authMiddleware from '../middlewares/auth.middleware.js';
import * as orderController from '../controllers/order.controller.js';

const router = express.Router();

router.use(authMiddleware.protect);

router
  .route('/')
  .get(authMiddleware.restrictTo('admin'), orderController.getOrders)
  .patch(authMiddleware.restrictTo('user'), orderController.confirmOrder);

router.get('/user', orderController.getUserOrders);

router.post(
  '/create-payment-intent/:id',
  authMiddleware.restrictTo('user'),
  orderController.createPaymentIntent,
);

router
  .route('/:id')
  .get(orderController.getOrder)
  .patch(orderController.updateOrder)
  .delete(orderController.deleteOrder);

export default router;
