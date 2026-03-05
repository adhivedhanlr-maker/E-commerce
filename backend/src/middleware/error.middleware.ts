import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    // Priority: err.statusCode (from AppError) > res.statusCode (if already set) > 500
    const statusCode = err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);

    logger.error(`${err.message} - ${req.method} ${req.url}`);

    res.status(statusCode).json({
        success: false,
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

export default errorHandler;
