import { Router } from 'express';
import { loginUser, logoutUser, protectedUser, registerUser } from '../controllers/userAuthController';
import requireAuthentication from '../middlewares/authMiddleware';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/auth', requireAuthentication, protectedUser);

export default router;
