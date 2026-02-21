import { Request, Response } from 'express';
import Category from '../models/category.model';
import asyncHandler from '../utils/asyncHandler';
import { sendResponse, AppError } from '../utils/response';

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = asyncHandler(async (req: Request, res: Response) => {
    const categories = await Category.find({}).populate('parentCategory');
    sendResponse(res, 200, true, 'Categories fetched successfully', categories);
});

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = asyncHandler(async (req: Request, res: Response) => {
    const { name, slug, description, image, parentCategory } = req.body;

    const categoryExists = await Category.findOne({ slug });
    if (categoryExists) {
        throw new AppError('Category already exists', 400);
    }

    const category = await Category.create({
        name,
        slug,
        description,
        image,
        parentCategory,
    });

    sendResponse(res, 201, true, 'Category created successfully', category);
});

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
    const category = await Category.findById(req.params.id);

    if (category) {
        await Category.deleteOne({ _id: category._id });
        sendResponse(res, 200, true, 'Category removed successfully');
    } else {
        throw new AppError('Category not found', 404);
    }
});
