'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Upload, Package, BarChart3, Settings, Plus, LayoutGrid, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function SellerDashboardPage() {
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

