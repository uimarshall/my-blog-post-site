import { Router } from 'express';
import { registerUser } from '../controllers/userAuthController';

const router = Router();

router.post('/register', registerUser);

export default router;
