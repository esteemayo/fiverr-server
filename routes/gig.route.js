import express from 'express';

import * as gigController from '../controllers/gig.controller.js';
import * as authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

router
  .route('/')
  .get(gigController.getGigs)
  .post(authMiddleware.protect, gigController.createGig);

router
  .route('/:id')
  .get(gigController.getGig)
  .delete(authMiddleware.protect, gigController.deleteGig);

export default router;
