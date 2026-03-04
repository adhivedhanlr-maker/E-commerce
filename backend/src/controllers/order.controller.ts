import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Order from '../models/order.model';
import asyncHandler from '../utils/asyncHandler';
import { sendResponse, AppError } from '../utils/response';
import { AuthRequest } from '../middleware/auth.middleware';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const addOrderItems = asyncHandler(async (req: AuthRequest, res: Response) => {
    console.log("Received Order Request Body:", JSON.stringify(req.body, null, 2));
    console.log("User Context In Request:", req.user ? req.user._id : "NULL");

    if (!req.user?._id) {
        throw new AppError('User authentication failed - please login again', 401);
    }
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
        throw new AppError('Your cart is empty or no order items provided', 400);
    }

    // Validate each order item has a product ID and it's a valid ObjectId
    for (const item of orderItems) {
        if (!item.product) {
            throw new AppError(`Product missing for item: ${item.name}`, 400);
        }
        if (!mongoose.Types.ObjectId.isValid(item.product)) {
            throw new AppError(`Invalid product ID format for item: ${item.name}`, 400);
        }
    }

    try {
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
        console.log("Order Saved Successfully:", createdOrder._id);
        sendResponse(res, 201, true, 'Order created successfully', createdOrder);
    } catch (dbError: any) {
        console.error("Database Error creating order:", dbError);
        console.error("Payload that caused error:", JSON.stringify(orderItems, null, 2));
        throw new AppError(`Database Error: ${dbError.message}`, 500);
    }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user?._id) {
        throw new AppError('User context missing', 401);
    }
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
    console.log("Fetching orders for user:", req.user?._id);

    if (!req.user?._id) {
        throw new AppError('User authentication failed - no ID found in context', 401);
    }

    try {
        const orders = await Order.find({ user: req.user._id });
        console.log(`Found ${orders.length} orders for user ${req.user._id}`);
        sendResponse(res, 200, true, 'User orders fetched successfully', orders);
    } catch (error: any) {
        console.error("Error fetching user orders from DB:", error);
        throw new AppError(`Database query failed: ${error.message}`, 500);
    }
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = asyncHandler(async (req: Request, res: Response) => {
    const orders = await Order.find({}).populate('user', 'id name');
    sendResponse(res, 200, true, 'All orders fetched successfully', orders);
});
