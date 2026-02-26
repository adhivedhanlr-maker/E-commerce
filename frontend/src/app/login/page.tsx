'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { loginUser } from '@/services/authService';
import { useAuth } from '@/store/useAuth';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const setUser = useAuth((state) => state.setUser);

    const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginForm) => {
        try {
            const response = await loginUser(data);
            if (response.success) {
                setUser(response.data);
                router.push('/');
            }
        } catch (error) {
            const err = error as { response?: { data?: { message?: string } } };
            setError('root', { message: err.response?.data?.message || 'Login failed' });
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 dark:bg-slate-900">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full"
            >
                <Card className="rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border dark:border-slate-800 overflow-hidden">
                    <CardContent className="p-8">
                        <div className="text-center mb-10">
                            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary-50 text-primary-600 mb-4 dark:bg-primary-900/20">
                                <LogIn className="h-8 w-8" />
                            </div>
                            <h1 className="text-2xl font-black text-slate-900 dark:text-white">Welcome Back</h1>
                            <p className="text-sm text-slate-500 mt-2">Enter your credentials to access your account</p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {errors.root && (
                                <div className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-xl text-sm flex items-center gap-2 dark:bg-red-900/10 dark:border-red-900/20">
                                    <AlertCircle className="h-4 w-4" />
                                    {errors.root.message}
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1 leading-none">Email Address</label>
                                <div className="relative">
                                    <Input
                                        {...register('email')}
                                        type="email"
                                        placeholder="name@example.com"
                                        className={cn(
                                            "rounded-xl border-slate-200 bg-slate-50/50 pl-11 h-12 text-sm focus-visible:ring-primary-500 transition-all",
                                            errors.email && "border-red-500 bg-red-50/50"
                                        )}
                                    />
                                    <Mail className="absolute left-4 top-4 h-4 w-4 text-slate-400" />
                                </div>
                                {errors.email && <p className="text-[10px] text-red-500 font-bold ml-1 uppercase tracking-wider">{errors.email.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400 leading-none">Password</label>
                                    <Link href="/forgot-password">
                                        <span className="text-[10px] text-primary-600 font-bold uppercase tracking-wider hover:underline">Forgot?</span>
                                    </Link>
                                </div>
                                <div className="relative">
                                    <Input
                                        {...register('password')}
                                        type="password"
                                        placeholder="••••••••"
                                        className={cn(
                                            "rounded-xl border-slate-200 bg-slate-50/50 pl-11 h-12 text-sm focus-visible:ring-primary-500 transition-all",
                                            errors.password && "border-red-500 bg-red-50/50"
                                        )}
                                    />
                                    <Lock className="absolute left-4 top-4 h-4 w-4 text-slate-400" />
                                </div>
                                {errors.password && <p className="text-[10px] text-red-500 font-bold ml-1 uppercase tracking-wider">{errors.password.message}</p>}
                            </div>

                            <Button
                                disabled={isSubmitting}
                                type="submit"
                                className="w-full bg-slate-900 text-white h-14 rounded-xl font-bold hover:bg-primary-600 transition-all shadow-lg hover:shadow-primary-500/20 disabled:opacity-50"
                            >
                                {isSubmitting ? 'Signing in...' : 'Sign In'}
                            </Button>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-slate-200 dark:border-slate-800" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white dark:bg-slate-900 px-2 text-slate-500 font-bold tracking-widest">Or continue with</span>
                                </div>
                            </div>

                            <Button
                                type="button"
                                variant="outline"
                                className="w-full h-14 rounded-xl font-bold bg-white hover:bg-slate-50 border-slate-200 text-slate-900 dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-slate-800 dark:text-white transition-all shadow-sm"
                                onClick={async () => {
                                    try {
                                        // Simulate Google Auth for demonstration
                                        await loginUser({
                                            email: 'google@example.com',
                                            password: 'google_oauth_placeholder' // The backend doesn't check password for Google Auth if we use the googleLogin endpoint
                                        });
                                        
                                        // Actually call the google endpoint
                                        const { googleLoginUser } = await import('@/services/authService');
                                        const googleResponse = await googleLoginUser({
                                            token: 'mock_google_token',
                                            email: 'john.google@example.com',
                                            name: 'John Google'
                                        });

                                        if (googleResponse.success) {
                                            setUser(googleResponse.data);
                                            router.push('/');
                                        }
                                    } catch {
                                        setError('root', { message: 'Google Sign-In failed' });
                                    }
                                }}
                            >
                                <FcGoogle className="mr-2 h-6 w-6" />
                                Google
                            </Button>
                        </form>

                        <p className="text-center mt-8 text-sm text-slate-500">
                            Don&apos;t have an account?{' '}
                            <Link href="/register">
                                <span className="text-primary-600 font-bold hover:underline">Create Account</span>
                            </Link>
                        </p>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}

// Utility to fix the cn issue in this file environment
function cn(...inputs: (string | boolean | undefined)[]) {
    return inputs.filter(Boolean).join(' ');
}
