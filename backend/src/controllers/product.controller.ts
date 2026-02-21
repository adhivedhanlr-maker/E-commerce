import { Request, Response } from 'express';
import Product from '../models/product.model';
import asyncHandler from '../utils/asyncHandler';
import { sendResponse, AppError } from '../utils/response';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req: Request, res: Response) => {
    const pageSize = Number(req.query.pageSize) || 12;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword
        ? {
            name: {
                $regex: req.query.keyword,
                $options: 'i',
            },
        }
        : {};

    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword })
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    sendResponse(res, 200, true, 'Products fetched successfully', {
        products,
        page,
        pages: Math.ceil(count / pageSize),
    });
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = asyncHandler(async (req: Request, res: Response) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        sendResponse(res, 200, true, 'Product fetched successfully', product);
    } else {
        throw new AppError('Product not found', 404);
    }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = asyncHandler(async (req: Request, res: Response) => {
    const product = new Product({
        name: 'Sample Name',
        price: 0,
        originalPrice: 0,
        user: (req as any).user._id,
        images: ['/images/sample.jpg'],
        brand: 'Sample Brand',
        category: 'Sample Category',
        countInStock: 0,
        numReviews: 0,
        description: 'Sample Description',
    });

    const createdProduct = await product.save();
    sendResponse(res, 201, true, 'Product created successfully', createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
    const {
        name,
        price,
        description,
        images,
        brand,
        category,
        countInStock,
        originalPrice,
        discountPercentage,
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        product.name = name ?? product.name;
        product.price = price ?? product.price;
        product.description = description ?? product.description;
        product.images = images ?? product.images;
        product.brand = brand ?? product.brand;
        product.category = category ?? product.category;
        product.countInStock = countInStock ?? product.countInStock;
        product.originalPrice = originalPrice ?? product.originalPrice;
        product.discountPercentage = discountPercentage ?? product.discountPercentage;

        const updatedProduct = await product.save();
        sendResponse(res, 200, true, 'Product updated successfully', updatedProduct);
    } else {
        throw new AppError('Product not found', 404);
    }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        await Product.deleteOne({ _id: product._id });
        sendResponse(res, 200, true, 'Product removed successfully');
    } else {
        throw new AppError('Product not found', 404);
    }
});
