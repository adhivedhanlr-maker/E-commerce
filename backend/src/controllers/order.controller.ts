import { Request, Response } from 'express';
import Order from '../models/order.model';
import asyncHandler from '../utils/asyncHandler';
import { sendResponse, AppError } from '../utils/response';
import { AuthRequest } from '../middleware/auth.middleware';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const addOrderItems = asyncHandler(async (req: AuthRequest, res: Response) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        throw new AppError('No order items', 400);
    } else {
        const order = new Order({
            orderItems,
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        });

        const createdOrder = await order.save();
        sendResponse(res, 201, true, 'Order created successfully', createdOrder);
    }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = asyncHandler(async (req: AuthRequest, res: Response) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (order) {
        sendResponse(res, 200, true, 'Order fetched successfully', order);
    } else {
        throw new AppError('Order not found', 404);
    }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
export const updateOrderToPaid = asyncHandler(async (req: AuthRequest, res: Response) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isPaid = true;
        order.paidAt = new Date();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.email_address,
        };

        const updatedOrder = await order.save();
        sendResponse(res, 200, true, 'Order paid successfully', updatedOrder);
    } else {
        throw new AppError('Order not found', 404);
    }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = asyncHandler(async (req: AuthRequest, res: Response) => {
    const orders = await Order.find({ user: req.user._id });
    sendResponse(res, 200, true, 'User orders fetched successfully', orders);
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = asyncHandler(async (req: Request, res: Response) => {
    const orders = await Order.find({}).populate('user', 'id name');
    sendResponse(res, 200, true, 'All orders fetched successfully', orders);
});
