import express from 'express';
import {
    getAllSellers,
    updateSellerStatus
} from '../controllers/admin.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/sellers', getAllSellers);
router.put('/sellers/:id/status', updateSellerStatus);

export default router;
