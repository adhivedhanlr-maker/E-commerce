'use client';

import React from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, KeyRound, CheckCircle2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const forgotPasswordSchema = z.object({
    email: z.string().email('Invalid email address'),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
    const [isSubmitted, setIsSubmitted] = React.useState(false);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordForm>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = async (data: ForgotPasswordForm) => {
        // Simulating API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
        console.log('Reset link requested for:', data.email);
        setIsSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 dark:bg-slate-900 pt-20">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full"
            >
                <Card className="rounded-[40px] shadow-premium border-none dark:bg-slate-900 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/10 blur-3xl -mr-16 -mt-16 rounded-full" />

                    <CardContent className="p-10">
                        <Link
                            href="/login"
                            className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary-600 transition-colors mb-8 group"
                        >
                            <ArrowLeft className="h-3 w-3 mr-2 transition-transform group-hover:-translate-x-1" />
                            Back to Login
                        </Link>

                        {!isSubmitted ? (
                            <>
                                <div className="text-left mb-10">
                                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-[24px] bg-primary-50 text-primary-600 mb-6 dark:bg-primary-900/20">
                                        <KeyRound className="h-8 w-8" />
                                    </div>
                                    <h1 className="text-3xl font-bold text-slate-950 dark:text-white leading-tight uppercase tracking-tight italic">Forgot <br /> <span className="text-primary-600 not-italic">Password?</span></h1>
                                    <p className="text-sm text-slate-500 mt-4 leading-relaxed">Enter your registered email address and we&apos;ll send you instructions to reset your password.</p>
                                </div>

                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 leading-none">Email Address</label>
                                        <div className="relative">
                                            <Input
                                                {...register('email')}
                                                type="email"
                                                placeholder="name@example.com"
                                                className={cn(
                                                    "rounded-2xl border-slate-200 bg-slate-50/50 pl-12 h-14 text-sm focus-visible:ring-primary-600 transition-all dark:bg-white/5 dark:border-white/10 dark:text-white",
                                                    errors.email && "border-red-500 bg-red-50/50"
                                                )}
                                            />
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                        </div>
                                        {errors.email && <p className="text-[10px] text-red-500 font-bold ml-1 uppercase tracking-wider">{errors.email.message}</p>}
                                    </div>

                                    <Button
                                        disabled={isSubmitting}
                                        type="submit"
                                        className="w-full bg-slate-950 text-white h-16 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-primary-600 transition-all shadow-xl hover:shadow-primary-500/20 disabled:opacity-50 group dark:bg-white dark:text-slate-950 dark:hover:bg-primary-600 dark:hover:text-white"
                                    >
                                        {isSubmitting ? 'Requesting Link...' : (
                                            <span className="flex items-center">
                                                Send Reset Instructions
                                            </span>
                                        )}
                                    </Button>
                                </form>
                            </>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-4"
                            >
                                <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-green-50 text-green-500 mb-8 dark:bg-green-900/20">
                                    <CheckCircle2 className="h-10 w-10" />
                                </div>
                                <h1 className="text-2xl font-bold text-slate-950 dark:text-white mb-4 uppercase tracking-tight">Check your Email</h1>
                                <p className="text-sm text-slate-500 leading-relaxed mb-10">
                                    We have sent password reset instructions to your email address. Please check your inbox and spam folder.
                                </p>
                                <Button
                                    asChild
                                    variant="outline"
                                    className="h-14 px-8 rounded-xl font-bold uppercase tracking-widest text-[10px]"
                                >
                                    <Link href="/login">Return to Login</Link>
                                </Button>
                                <p className="mt-8 text-xs text-slate-400">
                                    Didn&apos;t receive any email? <br />
                                    <button
                                        onClick={() => setIsSubmitted(false)}
                                        className="text-primary-600 font-bold hover:underline mt-1"
                                    >
                                        Try again with a different email
                                    </button>
                                </p>
                            </motion.div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
