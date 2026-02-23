'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { registerUser } from '@/services/authService';
import { useAuth } from '@/store/useAuth';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don&apos;t match",
    path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const router = useRouter();
    const setUser = useAuth((state) => state.setUser);

    const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterForm) => {
        try {
            const { confirmPassword: _unused, ...rest } = data;
            const response = await registerUser(rest);
            if (response.success) {
                setUser(response.data);
                router.push('/');
            }
        } catch (error) {
            const err = error as { response?: { data?: { message?: string } } };
            setError('root', { message: err.response?.data?.message || 'Registration failed' });
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
                                <UserPlus className="h-8 w-8" />
                            </div>
                            <h1 className="text-2xl font-black text-slate-900 dark:text-white">Create Account</h1>
                            <p className="text-sm text-slate-500 mt-2">Join NexusStore and start shopping today</p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            {errors.root && (
                                <div className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-xl text-sm flex items-center gap-2 dark:bg-red-900/10 dark:border-red-900/20">
                                    <AlertCircle className="h-4 w-4" />
                                    {errors.root.message}
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1 leading-none">Full Name</label>
                                <div className="relative">
                                    <Input
                                        {...register('name')}
                                        type="text"
                                        placeholder="John Doe"
                                        className={cn(
                                            "rounded-xl border-slate-200 bg-slate-50/50 pl-11 h-12 text-sm focus-visible:ring-primary-500 transition-all",
                                            errors.name && "border-red-500 bg-red-50/50"
                                        )}
                                    />
                                    <User className="absolute left-4 top-4 h-4 w-4 text-slate-400" />
                                </div>
                                {errors.name && <p className="text-[10px] text-red-500 font-bold ml-1 uppercase tracking-wider">{errors.name.message}</p>}
                            </div>

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

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1 leading-none">Password</label>
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
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1 leading-none">Confirm</label>
                                    <div className="relative">
                                        <Input
                                            {...register('confirmPassword')}
                                            type="password"
                                            placeholder="••••••••"
                                            className={cn(
                                                "rounded-xl border-slate-200 bg-slate-50/50 pl-11 h-12 text-sm focus-visible:ring-primary-500 transition-all",
                                                errors.confirmPassword && "border-red-500 bg-red-50/50"
                                            )}
                                        />
                                        <Lock className="absolute left-4 top-4 h-4 w-4 text-slate-400" />
                                    </div>
                                </div>
                            </div>
                            {(errors.password || errors.confirmPassword) && (
                                <p className="text-[10px] text-red-500 font-bold ml-1 uppercase tracking-wider">
                                    {errors.password?.message || errors.confirmPassword?.message}
                                </p>
                            )}

                            <Button
                                disabled={isSubmitting}
                                type="submit"
                                className="w-full bg-slate-900 text-white h-14 mt-4 rounded-xl font-bold hover:bg-primary-600 transition-all shadow-lg hover:shadow-primary-500/20 disabled:opacity-50"
                            >
                                {isSubmitting ? 'Creating Account...' : 'Sign Up'}
                            </Button>
                        </form>

                        <p className="text-center mt-8 text-sm text-slate-500">
                            Already have an account?{' '}
                            <Link href="/login">
                                <span className="text-primary-600 font-bold hover:underline">Sign In</span>
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
