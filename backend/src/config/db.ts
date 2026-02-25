import mongoose from 'mongoose';
import dns from 'dns';
import logger from '../utils/logger';

// Force use of Google DNS to bypass local router issues with SRV records
dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce');
        logger.info(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error: any) {
        logger.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;
