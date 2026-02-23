import jwt from 'jsonwebtoken';

export const generateAccessToken = (id: string, role: string) => {
    return jwt.sign({ id, role }, process.env.JWT_ACCESS_SECRET!, {
        expiresIn: (process.env.JWT_ACCESS_EXPIRE as any) || '15m',
    });
};

export const generateRefreshToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET!, {
        expiresIn: (process.env.JWT_REFRESH_EXPIRE as any) || '7d',
    });
};

export const verifyToken = (token: string, secret: string) => {
    return jwt.verify(token, secret);
};
