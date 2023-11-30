import { Router } from 'express';

import AuthController from '../controllers/authController.js';


const router = Router();

// REGISTER - POST
router.post('/register', AuthController.register);

// LOGIN -POST
router.post('/login', AuthController.login);

export default router;
