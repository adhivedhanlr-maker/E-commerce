import express from 'express';
import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} from '../controllers/product.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

router.route('/').get(getProducts).post(protect, authorize('admin', 'seller'), createProduct);
router
    .route('/:id')
    .get(getProductById)
    .put(protect, authorize('admin', 'seller'), updateProduct)
    .delete(protect, authorize('admin'), deleteProduct);

export default router;
