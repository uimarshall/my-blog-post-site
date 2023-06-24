import { Router } from 'express';
import { loginUser, protectedUser, registerUser } from '../controllers/userAuthController';
import requireAuthentication from '../middlewares/authMiddleware';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/auth', requireAuthentication, protectedUser);

export default router;
