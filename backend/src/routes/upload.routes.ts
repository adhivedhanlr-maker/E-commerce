import express from 'express';
import multer from 'multer';
import { storage } from '../config/cloudinary';
import { protect } from '../middleware/auth.middleware';
import { sendResponse } from '../utils/response';

const router = express.Router();
const upload = multer({ storage });

router.post('/', protect, upload.single('image'), (req: any, res: any) => {
    if (req.file) {
        sendResponse(res, 200, true, 'Image uploaded successfully', {
            url: req.file.path,
        });
    } else {
        sendResponse(res, 400, false, 'No file uploaded');
    }
});

export default router;
