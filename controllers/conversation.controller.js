import { StatusCodes } from 'http-status-codes';
import asyncHandler from 'express-async-handler';

import { NotFoundError } from '../errors/notFound.js';
import Conversation from '../models/conversation.model.js';

export const getConversations = asyncHandler(async (req, res, next) => {
  const { isSeller, id: userId } = req.user;

  const conversation = await Conversation.find(
    isSeller ? { sellerId: userId } : { buyerId: userId },
  ).sort('-updatedAt');

  res.status(StatusCodes.OK).json(conversation);
});

export const getConversation = asyncHandler(async (req, res, next) => {
  const { id: conversationId } = req.params;

  const conversation = await Conversation.findOne({ id: conversationId });

  if (!conversation) {
    return next(
      new NotFoundError(
        `There is no conversation found with that ID → ${conversationId}`,
      ),
    );
  }

  res.status(StatusCodes.OK).json(conversation);
});

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
    { id: conversationId },
    {
      $set: {
        ...(isSeller ? { readBySeller: true } : { readByBuyer: true }),
      },
    },
    {
      new: true,
      runValidators: true,
    },
  );

  res.status(StatusCodes.OK).json(updatedConversation);
});

export const deleteConversation = asyncHandler(async (req, res, next) => {
  const { id: conversationId } = req.params;
  const { isSeller, id: userId } = req.user;

  const conversation = await Conversation.findOneAndDelete({
    id: conversationId,
    ...(isSeller ? { sellerId: userId } : { buyerId: userId }),
  });

  if (!conversation) {
    return next(
      NotFoundError(
        `There is no conversation found with that ID → ${conversationId}`,
      ),
    );
  }

  res.status(StatusCodes.NO_CONTENT).end();
});
