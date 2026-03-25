import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Product from './src/models/product.model';
import dns from 'dns';

dotenv.config();

try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (err) {}

const checkDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI!);
        console.log('Connected to DB');
        
        const products = await Product.find({}).limit(5);
        console.log('--- DB PRODUCTS CHECK ---');
        products.forEach(p => {
            console.log(`Product: ${p.name}`);
            console.log(`Images[0]: ${p.images[0]}`);
        });
        console.log('-------------------------');
        
        process.exit();
    } catch (error: any) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

checkDB();
