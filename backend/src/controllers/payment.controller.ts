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

    console.log(`[Payment] Initiating ${paymentMethod} payment for amount: ${amount}`);

    if (!paymentMethod || !amount || amount <= 0) {
        throw new AppError('Valid payment method and positive amount are required', 400);
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
    console.log(`[Payment] Transaction ${transactionId} saved as PENDING`);

    // Start a background process to "approve" the payment after 5 seconds
    setTimeout(async () => {
        try {
            const txn = await Transaction.findOne({ transactionId });
            if (txn) {
                txn.status = 'COMPLETED';
                await txn.save();
                console.log(`[MOCK GATEWAY] Transaction ${transactionId} approved successfully.`);
            } else {
                console.warn(`[MOCK GATEWAY] Transaction ${transactionId} not found for approval!`);
            }
        } catch (err) {
            console.error('[MOCK GATEWAY] Error in mock approval timer:', err);
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
