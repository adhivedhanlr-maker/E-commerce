import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import asyncHandler from '../utils/asyncHandler';
import User from '../models/user.model';
import { AppError } from '../utils/response';
import logger from '../utils/logger';

export interface AuthRequest extends Request {
    user?: any;
}

export const protect = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            // Development hack: Allow demo token
            if (token === 'demo-access-token') {
                logger.info('Using development demo token');

                // Ensure we have a real Mongoose document so .save() works in controllers
                let user = await User.findOne({ email: 'dev@example.com' });
                if (!user) {
                    user = await User.create({
                        name: 'Demo Developer',
                        email: 'dev@example.com',
                        password: 'password123',
                        role: 'admin'
                    });
                }
                req.user = user;
                return next();
            }

            const secret = process.env.JWT_ACCESS_SECRET || 'your_access_token_secret';
            const decoded: any = jwt.verify(token!, secret);

            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return next(new AppError('User not found in database', 404));
            }

            next();
        } catch (error: any) {
            let message = 'Not authorized, token failed';
            if (error.name === 'TokenExpiredError') message = 'Session expired, please login again';
            if (error.name === 'JsonWebTokenError') message = 'Invalid session, please login again';

            next(new AppError(`${message}: ${error.message}`, 401));
        }
    }

    if (!token) {
        next(new AppError('Not authorized, no token', 401));
    }
});

export const authorize = (...roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return next(new AppError(`User role ${req.user?.role} is not authorized to access this route`, 403));
        }
        next();
    };
};
