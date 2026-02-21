import { Response } from 'express';

export const sendResponse = (res: Response, statusCode: number, success: boolean, message: string, data: any = null) => {
    return res.status(statusCode).json({
        success,
        message,
        data,
    });
};

export class AppError extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}
