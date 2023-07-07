import { Router } from 'express';
import {
  forgotPassword,
  loginUser,
  logoutUser,
  protectedUser,
  registerUser,
  resetPassword,
} from '../controllers/userAuthController';
import { requireAdminRole, requireAuthentication } from '../middlewares/authMiddleware';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
// Forgot password
router.post('/password/forgot', forgotPassword);
router.put('/password/reset/:token', resetPassword);
router.get('/auth', requireAuthentication, requireAdminRole, protectedUser);

export default router;
