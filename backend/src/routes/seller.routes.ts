import express from 'express';
import {
    saveOnboardingDraft,
    submitOnboarding,
    getOnboardingStatus
} from '../controllers/seller.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

// protect only specific routes that strictly require a logged-in user context
router.get('/onboarding/status', protect, getOnboardingStatus);
router.post('/onboarding/draft', protect, saveOnboardingDraft);
router.post('/onboarding/submit', protect, submitOnboarding);

export default router;
