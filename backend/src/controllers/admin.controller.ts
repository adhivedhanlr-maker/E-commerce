import { Request, Response } from 'express';
import User from '../models/user.model';
import { sendResponse } from '../utils/response';

export const getAllSellers = async (req: Request, res: Response) => {
    try {
        const { status } = req.query;
        const query: any = { role: { $in: ['user', 'seller', 'admin'] }, onboardingStatus: { $ne: 'none' } };
        
        if (status) {
            query.onboardingStatus = status;
        }

        const sellers = await User.find(query).select('-password');
        sendResponse(res, 200, true, 'Sellers fetched', sellers);
    } catch (error: any) {
        sendResponse(res, 500, false, error.message);
    }
};

export const updateSellerStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status, remarks } = req.body;

        const user = await User.findById(id);
        if (!user) {
            return sendResponse(res, 404, false, 'Seller not found');
        }

        user.onboardingStatus = status;
        if (status === 'approved' && user.role !== 'admin') {
            user.role = 'seller';
        } else if (status === 'rejected' && user.role !== 'admin') {
            user.role = 'user';
        }

        await user.save();
        // Here we would also send an email notification to the user

        sendResponse(res, 200, true, `Seller status updated to ${status}`);
    } catch (error: any) {
        sendResponse(res, 500, false, error.message);
    }
};
