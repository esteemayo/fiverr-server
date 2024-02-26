import express from 'express';

import * as authMiddleware from '../middlewares/auth.middleware.js';
import * as orderController from '../controllers/order.controller.js';

const router = express.Router();

router.get(
  '/',
  authMiddleware.protect,
  authMiddleware.restrictTo('admin'),
  orderController.getOrders,
);

router.get('/user', authMiddleware.protect, orderController.getUserOrders);

router.post(
  '/:gigId',
  authMiddleware.protect,
  authMiddleware.restrictTo('user'),
  orderController.createOrder,
);

router
  .route('/:id')
  .get(authMiddleware.protect, orderController.getOrder)
  .patch(authMiddleware.protect, orderController.updateOrder);

export default router;
