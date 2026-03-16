import express from 'express';
import multer from 'multer';
import { storage } from '../config/cloudinary';
import { protect } from '../middleware/auth.middleware';
import { sendResponse } from '../utils/response';

import logger from '../utils/logger';

const router = express.Router();
const upload = multer({ storage });

router.post('/', protect, (req, res, next) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            logger.error(`Upload error: ${err.message}`);
            return sendResponse(res, 500, false, `Upload error: ${err.message}`);
        }

        if (req.file) {
            sendResponse(res, 200, true, 'Image uploaded successfully', {
                url: req.file.path,
            });
        } else {
            sendResponse(res, 400, false, 'No file uploaded');
        }
    });
});

export default router;
