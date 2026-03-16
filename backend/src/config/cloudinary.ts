import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config();

const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
const api_key = process.env.CLOUDINARY_API_KEY;
const api_secret = process.env.CLOUDINARY_API_SECRET;

if (!cloud_name || !api_key || !api_secret) {
    console.warn('Cloudinary Error: Missing configuration environment variables');
    console.log('Variables found:', {
        CLOUDINARY_CLOUD_NAME: cloud_name ? 'Present' : 'Missing',
        CLOUDINARY_API_KEY: api_key ? 'Present' : 'Missing',
        CLOUDINARY_API_SECRET: api_secret ? 'Present' : 'Missing'
    });
}

cloudinary.config({
    cloud_name,
    api_key,
    api_secret,
});

export const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'nexus_products',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    } as any,
});

export { cloudinary };
