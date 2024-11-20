/* eslint-disable */

import { StatusCodes } from 'http-status-codes';
import asyncHandler from 'express-async-handler';

import Message from '../models/message.model.js';
import Conversation from '../models/conversation.model.js';

export const getMessages = asyncHandler(async (req, res, next) => {
  const { conversationId } = req.params;

  const messages = await Message.find({ conversationId });

  res.status(StatusCodes.OK).json(messages);
});

export const createMessage = asyncHandler(async (req, res, next) => {
  const { isSeller, id: userId } = req.user;

  if (!req.body.user) req.body.user = userId;

  const message = await Message.create({ ...req.body });
  await Conversation.findOneAndUpdate(
    { id: req.body.conversationId },
    {
      $set: {
        readBySeller: isSeller,
        readByBuyer: !isSeller,
        lastMessage: req.body.desc,
      },
    },
    {
      new: true,
      runValidators: true,
    },
  );

  res.status(StatusCodes.CREATED).json(message);
});
