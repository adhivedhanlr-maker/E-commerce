'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, LogIn, UserPlus, ShieldCheck, Mail, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/store/useAuth';

export default function SellerAuthPage() {
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuth();
    const router = useRouter();

    // Auto-redirect if already logged in
    useEffect(() => {
        if (user) {
            if (user.role === 'seller') {
                router.push('/seller/dashboard');
            } else {
                router.push('/seller/register');
            }
        }
    }, [user, router]);

    const handleContinue = async () => {
        if (!inputValue) return;
        setIsLoading(true);

        // Simulate a check and redirect to registration with the identity pre-filled
        setTimeout(() => {
            router.push(`/seller/register?identity=${encodeURIComponent(inputValue)}`);
        }, 800);
    };

    return (
        <div className="min-h-screen bg-white dark:bg-[#020617] flex flex-col items-center justify-center p-4 selection:bg-primary-100 selection:text-primary-900">
            {/* Background Decorations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full relative z-10"
            >
                {/* Logo Section */}
                <div className="text-center mb-10">
                    <Link href="/seller" className="inline-flex items-center gap-2 group mb-6 hover:scale-105 transition-transform duration-300">
                        <div className="w-14 h-14 rounded-3xl bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-white/5 flex items-center justify-center text-primary-600 transition-all duration-300 group-hover:rotate-6">
                            <ShieldCheck className="w-7 h-7" />
                        </div>
                        <span className="font-accent text-3xl font-black tracking-tight text-slate-950 dark:text-white">
                            Nexus<span className="text-primary-600">Seller</span>
                        </span>
                    </Link>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">Your selling journey starts here.</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-4 font-medium px-4">Enter your email or mobile to continue to your NexusStore Seller account.</p>
                </div>

                <Card className="border-none shadow-2xl bg-white/70 dark:bg-slate-900/50 backdrop-blur-3xl rounded-[40px] overflow-hidden border border-white/40 dark:border-white/5 mx-auto">
                    <CardContent className="p-10">
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                                    Email or Mobile Number
                                </label>
                                <div className="relative">
                                    <Input
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        placeholder="alex@example.com"
                                        className="h-16 rounded-2xl border-slate-200 dark:border-white/10 bg-white/50 dark:bg-slate-800/50 pl-14 text-base focus-visible:ring-primary-500 transition-all font-semibold"
                                    />
                                    <Mail className="absolute left-5 top-6 h-5 w-5 text-slate-400" />
                                </div>
                            </div>

                            <Button
                                onClick={handleContinue}
                                disabled={!inputValue || isLoading}
                                className="w-full h-16 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-primary-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 border-none"
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                        Checking...
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        Continue <ChevronRight className="w-5 h-5" />
                                    </div>
                                )}
                            </Button>

                            <div className="relative py-2">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-slate-100 dark:border-white/5" />
                                </div>
                                <div className="relative flex justify-center text-[10px] uppercase font-black tracking-[0.3em]">
                                    <span className="bg-transparent px-6 text-slate-400">Expertise Awaits</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Button
                                    variant="outline"
                                    asChild
                                    className="h-16 rounded-2xl border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 font-black text-[10px] uppercase tracking-wider flex flex-col items-center justify-center gap-2 group transition-all"
                                >
                                    <Link href="/login?redirect=/seller/dashboard">
                                        <LogIn className="w-5 h-5 text-primary-600 group-hover:scale-110 group-hover:-rotate-3 transition-transform" />
                                        <span>Sign In</span>
                                    </Link>
                                </Button>
                                <Button
                                    variant="outline"
                                    asChild
                                    className="h-16 rounded-2xl border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 font-black text-[10px] uppercase tracking-wider flex flex-col items-center justify-center gap-2 group transition-all"
                                >
                                    <Link href="/seller/register">
                                        <UserPlus className="w-5 h-5 text-emerald-500 group-hover:scale-110 group-hover:rotate-3 transition-transform" />
                                        <span>Register</span>
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="text-center mt-12 mb-8">
                    <Link href="/seller" className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-400 hover:text-primary-600 transition-all hover:gap-3">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Landing
                    </Link>
                </div>

                <div className="text-center opacity-40">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                        © 2026 NexusStore Ecosystem
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
