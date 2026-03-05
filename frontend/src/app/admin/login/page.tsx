'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { ShieldCheck, Mail, Lock, AlertCircle } from 'lucide-react';
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

function cn(...inputs: (string | boolean | undefined)[]) {
    return inputs.filter(Boolean).join(' ');
}

export default function AdminLoginPage() {
    const router = useRouter();
    const { setUser, user } = useAuth((state) => ({ setUser: state.setUser, user: state.user }));

    // If already logged in as admin, redirect to admin panel
    useEffect(() => {
        if (user?.role === 'admin') {
            router.push('/admin');
        }
    }, [user, router]);

    const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginForm) => {
        try {
            const response = await loginUser(data);
            if (response.success) {
                if (response.data.role !== 'admin') {
                    setError('root', { message: 'Access denied. This portal is for administrators only.' });
                    return;
                }
                setUser(response.data);
                router.push('/admin');
            }
        } catch (error) {
            const err = error as { response?: { data?: { message?: string } } };
            setError('root', { message: err.response?.data?.message || 'Login failed' });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)' }}>
            {/* Background pattern */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)' }} />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #4f46e5 0%, transparent 70%)' }} />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="max-w-md w-full relative z-10"
            >
                {/* Admin badge */}
                <div className="text-center mb-6">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        <ShieldCheck className="h-3 w-3" />
                        Administrator Portal
                    </span>
                </div>

                <Card className="rounded-3xl border border-white/10 shadow-2xl overflow-hidden" style={{ background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(24px)' }}>
                    <CardContent className="p-8">
                        <div className="text-center mb-10">
                            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl mb-4" style={{ background: 'linear-gradient(135deg, #4f46e5, #6366f1)' }}>
                                <ShieldCheck className="h-8 w-8 text-white" />
                            </div>
                            <h1 className="text-2xl font-black text-white">Admin Sign In</h1>
                            <p className="text-sm text-slate-400 mt-2">Restricted access — administrators only</p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {errors.root && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm flex items-center gap-2">
                                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                                    {errors.root.message}
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1 leading-none">Admin Email</label>
                                <div className="relative">
                                    <Input
                                        {...register('email')}
                                        type="email"
                                        placeholder="admin@example.com"
                                        className={cn(
                                            "rounded-xl pl-11 h-12 text-sm transition-all text-white placeholder:text-slate-600",
                                            "border-white/10 focus-visible:ring-indigo-500",
                                            errors.email && "border-red-500/50"
                                        )}
                                        style={{ background: 'rgba(255,255,255,0.05)' }}
                                    />
                                    <Mail className="absolute left-4 top-4 h-4 w-4 text-slate-500" />
                                </div>
                                {errors.email && <p className="text-[10px] text-red-400 font-bold ml-1 uppercase tracking-wider">{errors.email.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1 leading-none">Password</label>
                                <div className="relative">
                                    <Input
                                        {...register('password')}
                                        type="password"
                                        placeholder="••••••••"
                                        className={cn(
                                            "rounded-xl pl-11 h-12 text-sm transition-all text-white placeholder:text-slate-600",
                                            "border-white/10 focus-visible:ring-indigo-500",
                                            errors.password && "border-red-500/50"
                                        )}
                                        style={{ background: 'rgba(255,255,255,0.05)' }}
                                    />
                                    <Lock className="absolute left-4 top-4 h-4 w-4 text-slate-500" />
                                </div>
                                {errors.password && <p className="text-[10px] text-red-400 font-bold ml-1 uppercase tracking-wider">{errors.password.message}</p>}
                            </div>

                            <Button
                                disabled={isSubmitting}
                                type="submit"
                                className="w-full h-14 rounded-xl font-bold text-white transition-all shadow-lg disabled:opacity-50 hover:opacity-90"
                                style={{ background: 'linear-gradient(135deg, #4f46e5, #6366f1)', boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3)' }}
                            >
                                {isSubmitting ? 'Authenticating...' : 'Access Admin Panel'}
                            </Button>
                        </form>

                        <p className="text-center mt-8 text-sm text-slate-500">
                            Not an admin?{' '}
                            <Link href="/login">
                                <span className="text-indigo-400 font-bold hover:underline">User Login</span>
                            </Link>
                        </p>
                    </CardContent>
                </Card>

                <p className="text-center mt-4 text-xs text-slate-600">
                    Protected by role-based access control
                </p>
            </motion.div>
        </div>
    );
}
