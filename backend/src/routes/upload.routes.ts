import express from 'express';
import multer from 'multer';
import { storage } from '../config/cloudinary';
import { protect } from '../middleware/auth.middleware';
import { sendResponse } from '../utils/response';

import logger from '../utils/logger';

const router = express.Router();
const upload = multer({ storage });

router.post('/', protect, (req, res, next) => {
    // ... existing upload logic ...
});

router.get('/config-check', (req, res) => {
    res.json({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? 'Configured' : 'Missing',
        api_key: process.env.CLOUDINARY_API_KEY ? 'Configured' : 'Missing',
        api_secret: process.env.CLOUDINARY_API_SECRET ? 'Configured' : 'Missing',
        env: process.env.NODE_ENV || 'development'
    });
});

export default router;
