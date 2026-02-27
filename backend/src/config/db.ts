import mongoose from 'mongoose';
import dns from 'dns';
import logger from '../utils/logger';

// Force use of Google DNS to bypass local router issues with SRV records
// dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri) {
            logger.error('CRITICAL: MONGO_URI is not defined in environment variables!');
        } else {
            logger.info('Attempting to connect to MongoDB Atlas...');
        }
        const conn = await mongoose.connect(uri || 'mongodb://localhost:27017/ecommerce');
        logger.info(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error: any) {
        logger.error(`MongoDB connection error: ${error.message}`);
        // Removed process.exit(1) to allow the server to start for health checks
    }
};

export default connectDB;
