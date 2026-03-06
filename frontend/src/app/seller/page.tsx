'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    TrendingUp,
    Truck,
    ShieldCheck,
    Zap,
    Users,
    BadgePercent
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';

const BENEFITS = [
    {
        title: "₹26,000 worth of Ad Credits",
        description: "Launch your products with a boost. Get ad credits to reach more customers and drive sales from day one.",
        icon: Zap,
        color: "text-amber-500",
        bg: "bg-amber-500/10",
        border: "border-amber-500/20"
    },
    {
        title: "₹10,000 worth of FBA Fee Waiver",
        description: "Save on fulfillment costs. We&apos;ll waive your FBA fees for the first few months to help you scale efficiently.",
        icon: Truck,
        color: "text-emerald-500",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20"
    },
    {
        title: "₹5,000 worth of Selection Incentives",
        description: "Expand your catalog. Earn rewards for bringing in high-demand products that customers love.",
        icon: BadgePercent,
        color: "text-blue-500",
        bg: "bg-blue-500/10",
        border: "border-blue-500/20"
    }
];

const FEATURES = [
    {
        title: "Reach Millions",
        description: "Access a massive customer base looking for premium products every single day.",
        icon: Users
    },
    {
        title: "Secure Payments",
        description: "Get paid on time, every time. Our secure payment gateway ensures your peace of mind.",
        icon: ShieldCheck
    },
    {
        title: "Scale Fast",
        description: "Internal tools and analytics to help you understand trends and grow your business.",
        icon: TrendingUp
    }
];

export default function SellerLandingPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-[#020617] selection:bg-primary-100 selection:text-primary-900">
            {/* Navigation Header (Compact) */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#020617]/80 backdrop-blur-xl border-b border-slate-100 dark:border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="group flex items-center gap-2">
                        <span className="font-accent text-2xl font-black tracking-tight text-slate-950 dark:text-white">
                            Nexus<span className="text-primary-600">Store</span>
                        </span>
                    </Link>
                    <div className="flex items-center gap-6">
                        <Link href="/login" className="text-sm font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                            Log In
                        </Link>
                        <Button asChild className="rounded-full bg-orange-500 hover:bg-orange-600 text-white font-bold h-11 px-6 shadow-lg shadow-orange-500/20 border-none transition-all hover:scale-105 active:scale-95">
                            <Link href="/seller/auth">Start Selling</Link>
                        </Button>
                    </div>
                </div>
            </header>

            <main className="pt-20">
                {/* Hero Section */}
                <section className="relative overflow-hidden py-24 lg:py-32">
                    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="relative z-10"
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800/30 text-primary-600 dark:text-primary-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
                                <Zap className="w-3 h-3" />
                                Growth Opportunity
                            </div>
                            <h1 className="text-5xl lg:text-7xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight mb-8">
                                Launch your business & get benefits up to <span className="text-primary-600">₹41,000*</span>
                            </h1>
                            <p className="text-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-lg mb-12">
                                Register with a valid GSTIN and an active bank account to become a NexusStore seller and start reaching millions of customers today.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button asChild className="h-16 px-10 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white text-lg font-black shadow-2xl shadow-orange-500/30 transition-all hover:scale-105 active:scale-95">
                                    <Link href="/seller/auth">Start Selling</Link>
                                </Button>
                                <Button variant="outline" className="h-16 px-10 rounded-2xl border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-lg font-black hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                                    Learn More
                                </Button>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative"
                        >
                            <div className="relative aspect-[4/3] rounded-[40px] overflow-hidden shadow-2xl shadow-primary-500/10 border-8 border-white dark:border-slate-800">
                                <Image
                                    src="/images/seller/hero.png"
                                    alt="Successful Seller"
                                    fill
                                    className="object-cover"
                                />

                                {/* Floating Badges */}
                                <div className="absolute top-10 -left-6 bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-xl border border-slate-100 dark:border-white/5 flex items-center gap-3 animate-bounce-slow">
                                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                                        <Zap className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Incentive</p>
                                        <p className="text-sm font-black text-slate-900 dark:text-white">₹26k Ad Credits</p>
                                    </div>
                                </div>

                                <div className="absolute bottom-16 -right-6 bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-xl border border-slate-100 dark:border-white/5 flex items-center gap-3 animate-bounce-slow" style={{ animationDelay: '1s' }}>
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                        <Truck className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Global</p>
                                        <p className="text-sm font-black text-slate-900 dark:text-white">FBA Fee Waiver</p>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative Background Elements */}
                            <div className="absolute -z-10 -top-20 -right-20 w-64 h-64 bg-primary-100 dark:bg-primary-900/20 rounded-full blur-3xl opacity-50" />
                            <div className="absolute -z-10 -bottom-20 -left-20 w-64 h-64 bg-orange-100 dark:bg-orange-900/20 rounded-full blur-3xl opacity-50" />
                        </motion.div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                            {FEATURES.map((feature, i) => (
                                <motion.div
                                    key={feature.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: i * 0.1 }}
                                    className="space-y-4"
                                >
                                    <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-[24px] shadow-sm flex items-center justify-center mx-auto text-primary-600 border border-slate-100 dark:border-white/5">
                                        <feature.icon className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{feature.title}</h3>
                                    <p className="text-slate-500 dark:text-slate-400 font-medium">{feature.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Benefits Section */}
                <section className="py-32">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-20">
                            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
                                New Seller Incentives
                            </h2>
                            <p className="text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto">
                                We&apos;ve designed exclusive rewards to help you hit the ground running and maximize your growth from day one.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {BENEFITS.map((benefit, i) => (
                                <motion.div
                                    key={benefit.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: i * 0.1 }}
                                >
                                    <Card className={`h-full border ${benefit.border} bg-white dark:bg-slate-900 rounded-[32px] shadow-sm overflow-hidden group hover:shadow-xl hover:shadow-primary-500/5 transition-all duration-500`}>
                                        <CardContent className="p-8 lg:p-10 flex flex-col h-full">
                                            <div className={`w-14 h-14 rounded-2xl ${benefit.bg} flex items-center justify-center ${benefit.color} mb-8 mb-8 group-hover:scale-110 transition-transform duration-500`}>
                                                <benefit.icon className="w-7 h-7" />
                                            </div>
                                            <h3 className={`text-3xl font-black ${benefit.color} tracking-tight mb-4`}>
                                                {benefit.title.split('worth')[0]}
                                                <span className="block text-sm uppercase tracking-widest text-slate-400 mt-2">Worth Incentives</span>
                                            </h3>
                                            <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-8">
                                                {benefit.description}
                                            </p>
                                            <div className="mt-auto pt-6 border-t border-slate-100 dark:border-white/5">
                                                <Link href="/seller/auth" className={`inline-flex items-center gap-2 font-black text-sm uppercase tracking-widest ${benefit.color} hover:gap-3 transition-all`}>
                                                    Get Started <ArrowRight className="w-4 h-4" />
                                                </Link>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="py-24 bg-slate-950 dark:bg-white overflow-hidden relative">
                    <div className="max-w-7xl mx-auto px-6 relative z-10">
                        <div className="max-w-3xl">
                            <h2 className="text-4xl lg:text-6xl font-black text-white dark:text-slate-900 tracking-tight leading-tight mb-8">
                                Ready to build your legacy in e-commerce?
                            </h2>
                            <p className="text-xl text-slate-400 dark:text-slate-500 font-medium mb-12">
                                Join thousands of successful sellers who have chosen NexusStore as their home for growth and innovation. Registration takes less than 10 minutes.
                            </p>
                            <Button asChild className="h-16 px-12 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white text-lg font-black shadow-2xl shadow-primary-500/20 transition-all hover:scale-105 active:scale-95 border-none">
                                <Link href="/seller/auth">Join as a Seller</Link>
                            </Button>
                        </div>
                    </div>
                    {/* Decorative Background for CTA */}
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary-600/20 to-transparent" />
                </section>
            </main>

            <footer className="py-12 border-t border-slate-100 dark:border-white/5">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex flex-col md:flex-row items-center gap-4 md:space-x-8 text-[11px] font-black uppercase tracking-widest text-slate-400">
                        <span>© 2026 NexusStore</span>
                        <div className="flex space-x-8">
                            <Link href="#" className="hover:text-primary-600 transition-colors">Privacy</Link>
                            <Link href="#" className="hover:text-primary-600 transition-colors">Terms</Link>
                        </div>
                    </div>
                    <Link href="/" className="text-sm font-bold text-slate-500 hover:text-primary-600 transition-colors">
                        Back to Marketplace
                    </Link>
                </div>
            </footer>
        </div>
    );
}
