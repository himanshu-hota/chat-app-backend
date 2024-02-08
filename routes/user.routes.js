import express from 'express';

import { getUsers } from '../controllers/user.controller.js';
import protectRoute from '../middlewares/protectRoute.js';

const router = express.Router();

router.get('/', protectRoute, getUsers);

// router.get('/:id', protectRoute, getMessages);

export default router;

