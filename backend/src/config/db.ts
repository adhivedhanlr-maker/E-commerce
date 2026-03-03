import mongoose from 'mongoose';
import dns from 'dns';
import logger from '../utils/logger';

// Force use of Google DNS to bypass local router/ISP issues with SRV records
try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
    logger.info('DNS servers set to Google DNS for SRV resolution');
} catch (dnsErr: any) {
    logger.error(`Failed to set DNS servers: ${dnsErr.message}`);
}

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri) {
            logger.error('CRITICAL: MONGO_URI is not defined in environment variables!');
            return;
        }

        logger.info('Attempting to connect to MongoDB Atlas...');

        const conn = await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 10000, // Timeout after 10s instead of 30s
            socketTimeoutMS: 45000,
        });

        logger.info(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error: any) {
        logger.error(`MongoDB connection error: ${error.message}`);
        if (error.message.includes('querySrv')) {
            logger.error('DNS SRV Resolution failure detected. Check your MONGO_URI or DNS settings.');
        }
    }
};

export default connectDB;
