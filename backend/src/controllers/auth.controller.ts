import { Request, Response } from 'express';
import User from '../models/user.model';
import crypto from 'crypto';
import { generateAccessToken, generateRefreshToken } from '../utils/token';
import { sendResponse, AppError } from '../utils/response';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 10 * 365 * 24 * 60 * 60 * 1000, // 10 years in ms
    path: '/',
} as const;

const setAuthCookie = (res: Response, token: string) => {
    res.cookie('accessToken', token, COOKIE_OPTIONS);
};

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return sendResponse(res, 400, false, 'User already exists');
        }

        const hash = crypto.createHash('md5').update(email.toLowerCase().trim()).digest('hex');
        const gravatarUrl = `https://www.gravatar.com/avatar/${hash}?d=identicon`;

        const user = await User.create({ name, email, password, avatar: gravatarUrl });

        if (user) {
            const accessToken = generateAccessToken(user._id.toString(), user.role);
            const refreshToken = generateRefreshToken(user._id.toString());
            setAuthCookie(res, accessToken);
            sendResponse(res, 21, true, 'User registered successfully', {
                _id: user._id, name: user.name, email: user.email,
                role: user.role, avatar: user.avatar, onboardingStatus: user.onboardingStatus, accessToken, refreshToken,
            });
        } else {
            sendResponse(res, 400, false, 'Invalid user data');
        }
    } catch (error: any) {
        sendResponse(res, 500, false, error.message);
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            const accessToken = generateAccessToken(user._id.toString(), user.role);
            const refreshToken = generateRefreshToken(user._id.toString());

            if (!user.avatar) {
                const hash = crypto.createHash('md5').update(user.email.toLowerCase().trim()).digest('hex');
                user.avatar = `https://www.gravatar.com/avatar/${hash}?d=identicon`;
                await user.save();
            }

            setAuthCookie(res, accessToken);
            sendResponse(res, 200, true, 'Login successful', {
                _id: user._id, name: user.name, email: user.email,
                role: user.role, avatar: user.avatar, onboardingStatus: user.onboardingStatus, accessToken, refreshToken,
            });
        } else {
            sendResponse(res, 401, false, 'Invalid email or password');
        }
    } catch (error: any) {
        sendResponse(res, 500, false, error.message);
    }
};

export const googleLogin = async (req: Request, res: Response) => {
    try {
        const { token, email, name, picture } = req.body;

        if (!email) {
            return sendResponse(res, 400, false, 'Email is required from Google Auth');
        }

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                name: name || 'Google User', email, avatar: picture,
                password: Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8),
                role: 'user'
            });
        } else if (picture && !user.avatar) {
            user.avatar = picture;
            await user.save();
        } else if (!user.avatar) {
            const hash = crypto.createHash('md5').update(user.email.toLowerCase().trim()).digest('hex');
            user.avatar = `https://www.gravatar.com/avatar/${hash}?d=identicon`;
            await user.save();
        }

        const accessToken = generateAccessToken(user._id.toString(), user.role);
        const refreshToken = generateRefreshToken(user._id.toString());

        setAuthCookie(res, accessToken);
        sendResponse(res, 200, true, 'Google Login successful', {
            _id: user._id, name: user.name, email: user.email,
            role: user.role, avatar: user.avatar, onboardingStatus: user.onboardingStatus, accessToken, refreshToken,
        });
    } catch (error: any) {
        console.error('Google Auth Error:', error);
        sendResponse(res, 500, false, 'Google authentication failed');
    }
};

export const logout = async (req: Request, res: Response) => {
    res.clearCookie('accessToken', { path: '/' });
    sendResponse(res, 200, true, 'Logged out successfully', null);
};

export const updateUserProfile = async (req: any, res: Response) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;

            if (req.body.avatar) {
                user.avatar = req.body.avatar;
            } else if (!user.avatar) {
                const hash = crypto.createHash('md5').update(user.email.toLowerCase().trim()).digest('hex');
                user.avatar = `https://www.gravatar.com/avatar/${hash}?d=identicon`;
            }

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();
            const accessToken = generateAccessToken(updatedUser._id.toString(), updatedUser.role);
            const refreshToken = generateRefreshToken(updatedUser._id.toString());

            setAuthCookie(res, accessToken);
            sendResponse(res, 200, true, 'Profile updated successfully', {
                _id: updatedUser._id, name: updatedUser.name, email: updatedUser.email,
                role: updatedUser.role, avatar: updatedUser.avatar, onboardingStatus: updatedUser.onboardingStatus, accessToken, refreshToken,
            });
        } else {
            sendResponse(res, 404, false, 'User not found');
        }
    } catch (error: any) {
        sendResponse(res, 500, false, error.message);
    }
};

export const getProfile = async (req: any, res: Response) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) return sendResponse(res, 404, false, 'User not found');
        const accessToken = generateAccessToken(user._id.toString(), user.role);
        sendResponse(res, 200, true, 'Profile fetched', {
            _id: user._id, name: user.name, email: user.email,
            role: user.role, avatar: user.avatar, onboardingStatus: user.onboardingStatus, accessToken,
        });
    } catch (error: any) {
        sendResponse(res, 500, false, error.message);
    }
};

export const seedAdmin = async (req: Request, res: Response) => {
    try {
        const { secretKey } = req.body;
        const ADMIN_SECRET = process.env.ADMIN_SEED_SECRET || 'nexusadmin2024';

        if (secretKey !== ADMIN_SECRET) {
            return sendResponse(res, 403, false, 'Invalid secret key');
        }

        let admin = await User.findOne({ email: 'admin@nexusstore.com' });
        if (admin) {
            admin.role = 'admin';
            await admin.save();
        } else {
            admin = await User.create({
                name: 'NexusStore Admin',
                email: 'admin@nexusstore.com',
                password: 'Admin@123',
                role: 'admin',
            });
        }

        sendResponse(res, 200, true, 'Admin account ready', {
            email: 'admin@nexusstore.com',
            password: 'Admin@123',
        });
    } catch (error: any) {
        sendResponse(res, 500, false, error.message);
    }
};

