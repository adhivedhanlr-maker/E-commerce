import { Request, Response } from 'express';
import User from '../models/user.model';
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

        const user = await User.create({
            name,
            email,
            password,
        });

        if (user) {
            const accessToken = generateAccessToken(user._id.toString(), user.role);
            const refreshToken = generateRefreshToken(user._id.toString());

            sendResponse(res, 201, true, 'User registered successfully', {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
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

            sendResponse(res, 200, true, 'Login successful', {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
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
                password: Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8), // Dummy password
                role: 'user'
            });
        }

        const accessToken = generateAccessToken(user._id.toString(), user.role);
        const refreshToken = generateRefreshToken(user._id.toString());

        sendResponse(res, 200, true, 'Google Login successful', {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            accessToken,
            refreshToken,
        });

    } catch (error: any) {
        console.error('Google Auth Error:', error);
        sendResponse(res, 500, false, 'Google authentication failed');
    }
};
