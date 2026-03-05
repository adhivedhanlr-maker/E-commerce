import express from 'express';
import { register, login, googleLogin, updateUserProfile, logout, seedAdmin, getProfile } from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);
router.put('/profile', protect, updateUserProfile);
router.get('/profile', protect, getProfile);
router.post('/logout', logout);
router.post('/seed-admin', seedAdmin); // Bootstrap first admin

export default router;
