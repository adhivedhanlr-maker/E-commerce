import dotenv from 'dotenv';
import mongoose from 'mongoose';
import dns from 'dns';
import Product from './src/models/product.model';

dotenv.config();

try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (err) {}

const verify = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI!);
        console.log('Connected to DB');
        
        const lamp = await Product.findOne({ name: 'Lunar Orbital Lamp' });
        console.log('Lunar Orbital Lamp image:', lamp?.images[0]);
        
        const watch = await Product.findOne({ name: 'Titan Watch Pro' });
        console.log('Titan Watch Pro image:', watch?.images[0]);
        
        const total = await Product.countDocuments();
        console.log('Total products in DB:', total);
        
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

verify();
