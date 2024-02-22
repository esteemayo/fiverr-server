import express from 'express';

import * as authMiddleware from '../middlewares/auth.middleware.js';
import * as userController from '../controllers/user.controller.js';

const router = express.Router();

router.use(authMiddleware.protect);

router.patch('/update-me', userController.updateMe);

router.patch('/delete-me', userController.deleteMe);

router.route('/').get(userController.getUsers);

export default router;
