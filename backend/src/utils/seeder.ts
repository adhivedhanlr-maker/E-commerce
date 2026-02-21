import dotenv from 'dotenv';
import products from './products';
import User from '../models/user.model';
import Product from '../models/product.model';
import Order from '../models/order.model';
import Category from '../models/category.model';
import connectDB from '../config/db';
import logger from './logger';

dotenv.config();

connectDB();

const importData = async () => {
    try {
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();
        await Category.deleteMany();

        // Create Default Users
        await User.create([
            {
                name: 'Admin User',
                email: 'admin@example.com',
                password: 'password123',
                role: 'admin',
            },
            {
                name: 'Test Seller',
                email: 'seller@example.com',
                password: 'password123',
                role: 'seller',
            },
            {
                name: 'Test User',
                email: 'user@example.com',
                password: 'password123',
                role: 'user',
            },
        ] as any);

        // Create Categories
        const categoriesData = [
            { name: 'Electronics', slug: 'electronics', description: 'Cutting edge technology and gadgets.' },
            { name: 'Furniture', slug: 'furniture', description: 'Premium home and office furniture.' },
            { name: 'Apparel', slug: 'apparel', description: 'Designer clothing and exterior gear.' },
            { name: 'Lifestyle', slug: 'lifestyle', description: 'Curated goods for the modern life.' },
        ];
        await Category.insertMany(categoriesData);

        // Prepare Products
        const sampleProducts = products.map((product) => {
            return {
                ...product,
                images: [product.image],
                numReviews: product.numReviews || 0,
                rating: product.rating || 0,
            };
        });

        await Product.insertMany(sampleProducts as any);

        logger.info('Mass Data Imported Successfully!');
        process.exit();
    } catch (error: any) {
        logger.error(`Error importing data: ${String(error.message)}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();
        await Category.deleteMany();

        logger.info('Data Destroyed!');
        process.exit();
    } catch (error: any) {
        logger.error(`Error destroying data: ${String(error.message)}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
