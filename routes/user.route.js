import express from 'express';

import * as userController from '../controllers/user.controller.js';

const router = express.Router();

router.patch('/update-me', userController.updateMe);

export default router;
