import express from 'express';
import { initiatePayment, checkPaymentStatus } from '../controllers/payment.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/initiate', protect, initiatePayment);
router.get('/status/:id', protect, checkPaymentStatus);

export default router;
