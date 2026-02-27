import { Request, Response } from 'express';
import User from '../models/user.model';
import { sendResponse } from '../utils/response';

export const saveOnboardingDraft = async (req: Request, res: Response) => {
    try {
        const { businessProfile } = req.body;
        const user = (req as any).user;

        if (!user) {
            return sendResponse(res, 404, false, 'User not found in request');
        }

        console.log('Saving draft for user:', user._id);
        console.log('Draft data reaching backend:', JSON.stringify(businessProfile, null, 2));

        // Use Mongoose's built-in merging for subdocuments
        if (!user.businessProfile) {
            user.businessProfile = {};
        }

        // Manually merge nested objects to avoid overwriting them
        if (businessProfile.shopAddress) {
            user.businessProfile.shopAddress = { ...(user.businessProfile.shopAddress || {}), ...businessProfile.shopAddress };
            delete businessProfile.shopAddress;
        }
        if (businessProfile.bankDetails) {
            user.businessProfile.bankDetails = { ...(user.businessProfile.bankDetails || {}), ...businessProfile.bankDetails };
            delete businessProfile.bankDetails;
        }
        if (businessProfile.operationalDetails) {
            user.businessProfile.operationalDetails = { ...(user.businessProfile.operationalDetails || {}), ...businessProfile.operationalDetails };
            delete businessProfile.operationalDetails;
        }
        if (businessProfile.documents) {
            user.businessProfile.documents = { ...(user.businessProfile.documents || {}), ...businessProfile.documents };
            delete businessProfile.documents;
        }

        // Assign remaining flat fields
        Object.assign(user.businessProfile, businessProfile);

        user.onboardingStatus = 'draft';
        await user.save();

        console.log('Draft saved successfully');
        sendResponse(res, 200, true, 'Draft saved successfully', user.businessProfile);
    } catch (error: any) {
        console.error('Error in saveOnboardingDraft:', error);
        sendResponse(res, 500, false, `Draft save failed: ${error.message}`);
    }
};

export const submitOnboarding = async (req: Request, res: Response) => {
    try {
        const { businessProfile } = req.body;
        const user = (req as any).user;

        if (!user) {
            return sendResponse(res, 404, false, 'User not found in request');
        }

        console.log('Submitting onboarding for user:', user._id);

        if (!user.businessProfile) user.businessProfile = {};

        // Merge logic
        if (businessProfile.shopAddress) {
            user.businessProfile.shopAddress = { ...(user.businessProfile.shopAddress || {}), ...businessProfile.shopAddress };
            delete businessProfile.shopAddress;
        }
        if (businessProfile.bankDetails) {
            user.businessProfile.bankDetails = { ...(user.businessProfile.bankDetails || {}), ...businessProfile.bankDetails };
            delete businessProfile.bankDetails;
        }
        if (businessProfile.operationalDetails) {
            user.businessProfile.operationalDetails = { ...(user.businessProfile.operationalDetails || {}), ...businessProfile.operationalDetails };
            delete businessProfile.operationalDetails;
        }
        if (businessProfile.documents) {
            user.businessProfile.documents = { ...(user.businessProfile.documents || {}), ...businessProfile.documents };
            delete businessProfile.documents;
        }

        Object.assign(user.businessProfile, businessProfile);

        // Generate Registration ID if not present
        if (!user.businessProfile.operationalDetails) {
            user.businessProfile.operationalDetails = {};
        }

        if (!user.businessProfile.operationalDetails.registrationId) {
            const prefix = 'REG';
            const timestamp = Date.now().toString().slice(-6);
            const random = Math.floor(1000 + Math.random() * 9000);
            user.businessProfile.operationalDetails.registrationId = `${prefix}${timestamp}${random}`;
        }

        user.onboardingStatus = 'pending';
        await user.save();

        console.log('Onboarding submitted successfully');
        sendResponse(res, 200, true, 'Onboarding submitted for review', user.businessProfile);
    } catch (error: any) {
        console.error('Error in submitOnboarding:', error);
        sendResponse(res, 500, false, `Submission failed: ${error.message}`);
    }
};

export const getOnboardingStatus = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        if (!user) {
            return sendResponse(res, 404, false, 'User not found');
        }

        sendResponse(res, 200, true, 'Status fetched', {
            status: user.onboardingStatus,
            profile: user.businessProfile
        });
    } catch (error: any) {
        console.error('Error in getOnboardingStatus:', error);
        sendResponse(res, 500, false, `Status fetch failed: ${error.message}`);
    }
};
