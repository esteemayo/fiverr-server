import express from 'express';

import * as authMiddleware from '../middlewares/auth.middleware.js';
import * as orderController from '../controllers/order.controller.js';

const router = express.Router();

router.post(
  '/:gigId',
  authMiddleware.protect,
  authMiddleware.restrictTo('user'),
  orderController.createOrder,
);

export default router;
