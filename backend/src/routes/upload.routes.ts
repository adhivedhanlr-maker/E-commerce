import express from 'express';
import multer from 'multer';
import { storage } from '../config/cloudinary';
import { protect } from '../middleware/auth.middleware';
import { sendResponse } from '../utils/response';

import logger from '../utils/logger';

const router = express.Router();
const upload = multer({ storage });

router.post('/', protect, upload.single('image'), (req: any, res: any) => {
    try {
        if (!req.file) {
            logger.error('Upload attempt with no file');
            return sendResponse(res, 400, false, 'Please upload a file');
        }

        logger.info(`File uploaded successfully: ${req.file.path}`);
        sendResponse(res, 200, true, 'Image uploaded successfully', {
            url: req.file.path,
            public_id: req.file.filename
        });
    } catch (error: any) {
        logger.error(`Upload error: ${error.message}`);
        sendResponse(res, 500, false, error.message || 'Server error during upload');
    }
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
