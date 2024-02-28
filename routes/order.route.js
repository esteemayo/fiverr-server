import express from 'express';

import * as authMiddleware from '../middlewares/auth.middleware.js';
import * as orderController from '../controllers/order.controller.js';

const router = express.Router();

router.use(authMiddleware.protect);

router.get('/', authMiddleware.restrictTo('admin'), orderController.getOrders);

router.get('/user', orderController.getUserOrders);

router.post(
  '/:gigId',
  authMiddleware.restrictTo('user'),
  orderController.createOrder,
);

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
