import express from 'express';
import { register, login, googleLogin, updateUserProfile, logout } from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);
router.put('/profile', protect, updateUserProfile);
router.post('/logout', logout);

export default router;
