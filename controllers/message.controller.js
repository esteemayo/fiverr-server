import { StatusCodes } from 'http-status-codes';
import asyncHandler from 'express-async-handler';

import Message from '../models/message.model.js';

export const getMessages = asyncHandler(async (req, res, next) => {
  const { conversationId } = req.params;

  const messages = await Message.find({ conversation: conversationId });

  res.status(StatusCodes.OK).json(messages);
});
