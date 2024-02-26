import { StatusCodes } from 'http-status-codes';
import asyncHandler from 'express-async-handler';

import Conversation from '../models/conversation.model.js';

export const getConversations = asyncHandler(async (req, res, next) => {});

export const createConversation = asyncHandler(async (req, res, next) => {
  const { isSeller, id: userId } = req.user;

  const newConversation = {
    id: isSeller ? userId + req.body.to : req.body.to + userId,
    sellerId: isSeller ? userId : req.body.to,
    buyerId: isSeller ? req.body.to : userId,
    readBySeller: isSeller,
    readByBuyer: !isSeller,
  };

  const conversation = await Conversation.create({ ...newConversation });

  res.status(StatusCodes.CREATED).json(conversation);
});

export const updateConversation = asyncHandler(async (req, res, next) => {
  const { isSeller } = req.user;
  const { id: conversationId } = req.params;

  const updatedConversation = await Conversation.findOneAndUpdate(
    conversationId,
    {
      $set: {
        readBySeller: isSeller,
        readByBuyer: !isSeller,
      },
    },
    {
      new: true,
      runValidators: true,
    },
  );

  res.status(StatusCodes.OK).json(updatedConversation);
});
