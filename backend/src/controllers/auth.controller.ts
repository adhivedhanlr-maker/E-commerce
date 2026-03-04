import { Request, Response } from 'express';
import User from '../models/user.model';
import crypto from 'crypto';
import { generateAccessToken, generateRefreshToken } from '../utils/token';
import { sendResponse, AppError } from '../utils/response';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return sendResponse(res, 400, false, 'User already exists');
        }

        const hash = crypto.createHash('md5').update(email.toLowerCase().trim()).digest('hex');
        const gravatarUrl = `https://www.gravatar.com/avatar/${hash}?d=identicon`;

        const user = await User.create({
            name,
            email,
            password,
            avatar: gravatarUrl
        });

        if (user) {
            const accessToken = generateAccessToken(user._id.toString(), user.role);
            const refreshToken = generateRefreshToken(user._id.toString());

            sendResponse(res, 201, true, 'User registered successfully', {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                accessToken,
                refreshToken,
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

            // Assign Gravatar if missing
            if (!user.avatar) {
                const hash = crypto.createHash('md5').update(user.email.toLowerCase().trim()).digest('hex');
                user.avatar = `https://www.gravatar.com/avatar/${hash}?d=identicon`;
                await user.save();
            }

            sendResponse(res, 200, true, 'Login successful', {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                accessToken,
                refreshToken,
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
            // Register new user via Google
            user = await User.create({
                name: name || 'Google User',
                email,
                avatar: picture,
                password: Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8), // Dummy password
                role: 'user'
            });
        } else if (picture && !user.avatar) {
            // Update avatar if missing
            user.avatar = picture;
            await user.save();
        } else if (!user.avatar) {
            // Final fallback to Gravatar
            const hash = crypto.createHash('md5').update(user.email.toLowerCase().trim()).digest('hex');
            user.avatar = `https://www.gravatar.com/avatar/${hash}?d=identicon`;
            await user.save();
        }

        const accessToken = generateAccessToken(user._id.toString(), user.role);
        const refreshToken = generateRefreshToken(user._id.toString());

        sendResponse(res, 200, true, 'Google Login successful', {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            accessToken,
            refreshToken,
        });

    } catch (error: any) {
        console.error('Google Auth Error:', error);
        sendResponse(res, 500, false, 'Google authentication failed');
    }
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

            sendResponse(res, 200, true, 'Profile updated successfully', {
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                avatar: updatedUser.avatar,
                accessToken,
                refreshToken,
            });
        } else {
            sendResponse(res, 404, false, 'User not found');
        }
    } catch (error: any) {
        sendResponse(res, 500, false, error.message);
    }
};
