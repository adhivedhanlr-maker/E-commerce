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

            const decoded: any = jwt.verify(token!, process.env.JWT_ACCESS_SECRET!);

            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            next(new AppError('Not authorized, token failed', 401));
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
