import { Router } from 'express';

import userAuth from '../middlewares/authentication.js';
import UserController from '../controllers/userController.js';

const router = Router();

// UPDATE USER - PUT
router.put('/update-user', userAuth, UserController.updateUser);

export default router;
