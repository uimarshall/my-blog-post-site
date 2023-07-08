import { Router } from 'express';
import {
  forgotPassword,
  getUserProfile,
  loginUser,
  logoutUser,
  protectedUser,
  registerUser,
  resetPassword,
  updatePassword,
} from '../controllers/userAuthController';
import { requireAdminRole, requireAuthentication } from '../middlewares/authMiddleware';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
// Forgot password
router.post('/password/forgot', forgotPassword);
// Reset password
router.put('/password/reset/:token', resetPassword);
// Currently Login user-details or profile
router.get('/me', requireAuthentication, getUserProfile);
// Update password
router.put('/password/update', requireAuthentication, updatePassword);
router.get('/auth', requireAuthentication, requireAdminRole, protectedUser);

export default router;
