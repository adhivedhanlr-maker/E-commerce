import express from 'express';
import {
    saveOnboardingDraft,
    submitOnboarding,
    getOnboardingStatus
} from '../controllers/seller.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.use(protect); // All seller onboarding routes require authentication

router.get('/onboarding/status', getOnboardingStatus);
router.post('/onboarding/draft', saveOnboardingDraft);
router.post('/onboarding/submit', submitOnboarding);

export default router;
