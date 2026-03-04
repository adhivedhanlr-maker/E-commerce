import { Response } from 'express';
import Transaction from '../models/transaction.model';
import asyncHandler from '../utils/asyncHandler';
import { sendResponse, AppError } from '../utils/response';
import { AuthRequest } from '../middleware/auth.middleware';

// @desc    Initiate a mock payment
// @route   POST /api/payments/initiate
// @access  Private
export const initiatePayment = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { paymentMethod, amount } = req.body;

    if (!paymentMethod || !amount) {
        throw new AppError('Payment method and amount are required', 400);
    }

    const transactionId = `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const transaction = new Transaction({
        user: req.user?._id,
        paymentMethod,
        amount,
        transactionId,
        status: 'PENDING'
    });

    await transaction.save();

    // Start a background process to "approve" the payment after 5 seconds
    setTimeout(async () => {
        try {
            const txn = await Transaction.findOne({ transactionId });
            if (txn) {
                txn.status = 'COMPLETED';
                await txn.save();
                console.log(`[MOCK GATEWAY] Transaction ${transactionId} approved.`);
            }
        } catch (err) {
            console.error('Error in mock approval timer:', err);
        }
    }, 5000);

    sendResponse(res, 201, true, 'Payment initiated', { transactionId });
});

// @desc    Check payment status
// @route   GET /api/payments/status/:id
// @access  Private
export const checkPaymentStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
    const transaction = await Transaction.findOne({ transactionId: req.params.id });

    if (!transaction) {
        throw new AppError('Transaction not found', 404);
    }

    sendResponse(res, 200, true, 'Status fetched', {
        status: transaction.status,
        transactionId: transaction.transactionId
    });
});
