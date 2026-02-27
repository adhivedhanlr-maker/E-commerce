import { Request, Response } from 'express';
import User from '../models/user.model';
import { sendResponse } from '../utils/response';

export const saveOnboardingDraft = async (req: Request, res: Response) => {
    try {
        const { businessProfile } = req.body;
        const userId = (req as any).user._id;

        const user = await User.findById(userId);
        if (!user) {
            return sendResponse(res, 404, false, 'User not found');
        }

        user.businessProfile = { ...user.businessProfile, ...businessProfile };
        user.onboardingStatus = 'draft';
        await user.save();

        sendResponse(res, 200, true, 'Draft saved successfully', user.businessProfile);
    } catch (error: any) {
        sendResponse(res, 500, false, error.message);
    }
};

export const submitOnboarding = async (req: Request, res: Response) => {
    try {
        const { businessProfile } = req.body;
        const userId = (req as any).user._id;

        const user = await User.findById(userId);
        if (!user) {
            return sendResponse(res, 404, false, 'User not found');
        }

        const updatedProfile = { ...user.businessProfile, ...businessProfile };

        // Generate Registration ID if not present
        if (!updatedProfile.operationalDetails) {
            updatedProfile.operationalDetails = {} as any;
        }

        if (!updatedProfile.operationalDetails.registrationId) {
            const prefix = 'REG';
            const timestamp = Date.now().toString().slice(-6);
            const random = Math.floor(1000 + Math.random() * 9000);
            updatedProfile.operationalDetails.registrationId = `${prefix}${timestamp}${random}`;
        }

        user.businessProfile = updatedProfile;
        user.onboardingStatus = 'pending';
        // When submitting, we also ensure the role is set to seller (or wait for approval)
        // For now, let's keep it as is and wait for admin approval to change role if needed
        await user.save();

        sendResponse(res, 200, true, 'Onboarding submitted for review', user.businessProfile);
    } catch (error: any) {
        sendResponse(res, 500, false, error.message);
    }
};

export const getOnboardingStatus = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user._id;
        const user = await User.findById(userId).select('onboardingStatus businessProfile');

        if (!user) {
            return sendResponse(res, 404, false, 'User not found');
        }

        sendResponse(res, 200, true, 'Status fetched', {
            status: user.onboardingStatus,
            profile: user.businessProfile
        });
    } catch (error: any) {
        sendResponse(res, 500, false, error.message);
    }
};
