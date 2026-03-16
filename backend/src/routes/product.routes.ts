import express from 'express';
import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getMyProducts,
} from '../controllers/product.controller';
import { protect, authorize, isApprovedSeller } from '../middleware/auth.middleware';

const router = express.Router();

router.route('/').get(getProducts).post(protect, authorize('admin', 'seller'), isApprovedSeller, createProduct);
router.route('/myproducts').get(protect, authorize('seller'), isApprovedSeller, getMyProducts);
router
    .route('/:id')
    .get(getProductById)
    .put(protect, authorize('admin', 'seller'), isApprovedSeller, updateProduct)
    .delete(protect, authorize('admin'), deleteProduct);

export default router;
