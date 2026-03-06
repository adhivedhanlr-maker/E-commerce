'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Upload, Package, BarChart3, Settings, Plus, LayoutGrid, Zap, ShieldCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/store/useAuth';
import { AlertCircle, Clock, ShieldCheck } from 'lucide-react';

export default function SellerDashboardPage() {
    const { user } = useAuth();
    const router = useRouter();

    // Redirection and Status Check
    React.useEffect(() => {
        if (user && (user.onboardingStatus === 'none' || user.onboardingStatus === 'draft')) {
            router.push('/seller/register');
        }
    }, [user, router]);

    const stats = [
        { label: 'Total Products', value: '0', icon: Package, color: 'bg-blue-50 text-blue-600' },
        { label: 'Total Sales', value: '₹0.00', icon: BarChart3, color: 'bg-emerald-50 text-emerald-600' },
        { label: 'Pending Orders', value: '0', icon: Zap, color: 'bg-amber-50 text-amber-600' },
    ];

    const actions = [
        { title: 'Upload Product', description: 'Add new items to your store', icon: Upload, href: '/seller/upload', color: 'bg-primary-50 text-primary-600' },
        { title: 'Manage Inventory', description: 'Edit existing product details', icon: LayoutGrid, href: '/shop', color: 'bg-slate-50 text-slate-600' },
        { title: 'Store Settings', description: 'Update your business profile', icon: Settings, href: '/profile', color: 'bg-purple-50 text-purple-600' },
    ];

    if (!user) return null;

    if (user.onboardingStatus === 'pending') {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-2xl w-full"
                >
                    <Card className="rounded-[40px] border-none shadow-2xl bg-white dark:bg-slate-900/50 backdrop-blur-xl p-12 text-center overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-full h-2 bg-amber-500" />
                        <div className="w-24 h-24 bg-amber-50 dark:bg-amber-900/20 rounded-[32px] flex items-center justify-center mx-auto mb-8 text-amber-600">
                            <Clock className="w-12 h-12 animate-pulse" />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Application Under Review</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-lg mb-8 leading-relaxed">
                            Thank you for joining NexusStore! Our team is currently reviewing your business details.
                            We&apos;ll verify your documents and notify you via email once approved.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mb-10">
                            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex items-start gap-3">
                                <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                                <div>
                                    <p className="text-xs font-black uppercase text-slate-400">Security Check</p>
                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Documents Submitted</p>
                                </div>
                            </div>
                            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex items-start gap-3">
                                <Clock className="w-5 h-5 text-amber-500 shrink-0" />
                                <div>
                                    <p className="text-xs font-black uppercase text-slate-400">Timeframe</p>
                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Usually 24-48 Hours</p>
                                </div>
                            </div>
                        </div>
                        <Button
                            onClick={() => router.push('/')}
                            className="h-14 px-10 rounded-2xl bg-slate-900 text-white font-bold"
                        >
                            Return to Homepage
                        </Button>
                    </Card>
                </motion.div>
            </div>
        );
    }

    if (user.onboardingStatus === 'rejected') {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
                <Card className="max-w-md w-full rounded-[40px] border-none shadow-2xl bg-white dark:bg-slate-900/50 backdrop-blur-xl p-10 text-center">
                    <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-3xl flex items-center justify-center mx-auto mb-6 text-red-500">
                        <AlertCircle className="w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Registration Denied</h2>
                    <p className="text-slate-500 mb-8">We couldn&apos;t verify your business details. Please check your email for more information or contact support.</p>
                    <div className="space-y-4">
                        <Button onClick={() => router.push('/seller/register')} className="w-full h-14 rounded-2xl bg-primary-600 text-white font-bold shadow-xl shadow-primary-600/20">
                            Re-submit Application
                        </Button>
                        <Button variant="ghost" onClick={() => router.push('/')} className="w-full h-14 rounded-2xl text-slate-500 font-bold">
                            Back to Home
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-20 px-4">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12"
                >
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2">Seller Dashboard</h1>
                        <p className="text-slate-500 font-medium">Manage your business account and product listings</p>
                    </div>
                    <Link href="/seller/upload">
                        <Button className="rounded-2xl h-14 px-8 bg-primary-600 hover:bg-primary-700 text-white font-bold shadow-xl shadow-primary-600/20">
                            <Plus className="h-5 w-5 mr-2" />
                            Add New Product
                        </Button>
                    </Link>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className="rounded-3xl border-none shadow-premium bg-white dark:bg-white/5 p-6">
                                <div className="flex items-center gap-4">
                                    <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center", stat.color)}>
                                        <stat.icon className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
                                        <p className="text-2xl font-black text-slate-900 dark:text-white">{stat.value}</p>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {actions.map((action, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + i * 0.1 }}
                        >
                            <Link href={action.href}>
                                <Card className="group rounded-3xl border-none shadow-premium bg-white dark:bg-white/5 hover:bg-primary-600 transition-all duration-500 cursor-pointer overflow-hidden relative">
                                    <CardContent className="p-8">
                                        <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:bg-white/20 group-hover:text-white", action.color)}>
                                            <action.icon className="h-7 w-7" />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-white transition-colors">{action.title}</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 group-hover:text-white/80 transition-colors">{action.description}</p>
                                    </CardContent>
                                    <div className="absolute -bottom-4 -right-4 h-24 w-24 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all duration-500" />
                                </Card>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}

