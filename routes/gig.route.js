import express from 'express';

import * as gigController from '../controllers/gig.controller.js';
import * as authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(authMiddleware.protect);

router.get('/details/:slug', gigController.getGigBySlug);

router.route('/').get(gigController.getGigs).post(gigController.createGig);

router
  .route('/:id')
  .get(gigController.getGigById)
  .patch(gigController.updateGig)
  .delete(gigController.deleteGig);

export default router;
