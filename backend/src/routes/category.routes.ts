import express from 'express';
import {
    getCategories,
    createCategory,
    deleteCategory,
} from '../controllers/category.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

router.route('/').get(getCategories).post(protect, authorize('admin'), createCategory);
router.route('/:id').delete(protect, authorize('admin'), deleteCategory);

export default router;
