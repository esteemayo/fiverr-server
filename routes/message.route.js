import express from 'express';

import * as authMiddleware from '../middlewares/auth.middleware.js';
import * as messageController from '../controllers/message.controller.js';

const router = express.Router();

router.get(
  '/:conversationId',
  authMiddleware.protect,
  messageController.getMessages,
);

export default router;
