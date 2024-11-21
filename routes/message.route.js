/* eslint-disable */

import express from 'express';

import * as authMiddleware from '../middlewares/auth.middleware.js';
import * as messageController from '../controllers/message.controller.js';

const router = express.Router();

router.use(authMiddleware.protect);

router.get('/:conversationId', messageController.getMessages);

router.post('/', messageController.createMessage);

export default router;
