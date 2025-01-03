/* eslint-disable */

import { StatusCodes } from 'http-status-codes';
import asyncHandler from 'express-async-handler';

import { APIFeatures } from '../utils/apiFeatures.js';
import { NotFoundError } from '../errors/notFound.js';

export const getAll = (Model) =>
  asyncHandler(async (req, res, next) => {
    const features = new APIFeatures(Model.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const docs = await features.query;

    res.status(StatusCodes.OK).json(docs);
  });

export const getOneById = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id: docId } = req.params;

    const doc = await Model.findById(docId);

    if (!doc) {
      return next(
        new NotFoundError(
          `There is no document found with the given ID → ${docId}`,
        ),
      );
    }

    res.status(StatusCodes.OK).json(doc);
  });

export const getOneBySlug = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { slug } = req.params;

    const doc = await Model.findOne({ slug });

    if (!doc) {
      return next(
        new NotFoundError(
          `There is no document found with the given SLUG → ${slug}`,
        ),
      );
    }

    res.status(StatusCodes.OK).json(doc);
  });

export const createOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const doc = await Model.create({ ...req.body });

    res.status(StatusCodes.CREATED).json(doc);
  });

export const updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id: docId } = req.params;

    const updatedDoc = await Model.findByIdAndUpdate(
      docId,
      { $set: { ...req.body } },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedDoc) {
      return next(
        new NotFoundError(
          `There is no document found with the given ID → ${docId}`,
        ),
      );
    }

    res.status(StatusCodes.OK).json(doc);
  });

export const deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id: docId } = req.params;

    const doc = await Model.findByIdAndDelete(docId);

    if (!doc) {
      return next(
        new NotFoundError(
          `There is no document found with the given ID → ${docId}`,
        ),
      );
    }

    res.status(StatusCodes.NO_CONTENT).end();
  });
