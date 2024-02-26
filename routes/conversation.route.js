import express from 'express';

import * as authMiddleware from '../middlewares/auth.middleware.js';
import * as conversationController from '../controllers/conversation.controller.js';

const router = express.Router();

router.use(authMiddleware.protect);

router
  .route('/')
  .get(conversationController.getConversations)
  .post(conversationController.createConversation);

export default router;
