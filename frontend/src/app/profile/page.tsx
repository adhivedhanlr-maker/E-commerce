'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, Mail, Shield, LogOut, Settings, Bell, CreditCard, Package } from 'lucide-react';
import { useAuth } from '@/store/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export default function ProfilePage() {
    const router = useRouter();
    const { user, logout } = useAuth();

    useEffect(() => {
        if (!user) {
            router.push('/login');
        }
    }, [user, router]);

    if (!user) {
        return null; // Prevent flicker while redirecting
    }

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    const menuItems = [
        { icon: Package, label: 'My Orders', desc: 'Track and manage your purchases' },
        { icon: CreditCard, label: 'Payment Methods', desc: 'Securely manage your cards' },
        { icon: Bell, label: 'Notifications', desc: 'Configure your alert preferences' },
        { icon: Settings, label: 'Account Settings', desc: 'Personalize your profile' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 pb-24">
            <div className="mx-auto max-w-7xl px-6 lg:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: User Profile Overview */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-1"
                    >
                        <Card className="rounded-[32px] overflow-hidden border-none shadow-premium bg-white dark:bg-slate-900">
                            <div className="h-32 bg-primary-600 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-primary-700 to-primary-500" />
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl -mr-16 -mt-16 rounded-full" />
                            </div>
                            <CardContent className="pt-0 relative px-8 pb-8">
                                <div className="flex justify-center -mt-12 mb-6">
                                    <div className="h-24 w-24 rounded-3xl bg-slate-950 flex items-center justify-center text-4xl font-black text-white border-4 border-white dark:border-slate-900 shadow-xl overflow-hidden">
                                        {user.name.charAt(0)}
                                    </div>
                                </div>
                                <div className="text-center mb-8">
                                    <h2 className="text-2xl font-bold text-slate-950 dark:text-white mb-1 uppercase tracking-tight">{user.name}</h2>
                                    <div className="inline-flex items-center space-x-2 text-primary-600 bg-primary-50 dark:bg-primary-900/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-primary-100 dark:border-primary-800">
                                        <Shield className="h-3 w-3 fill-current" />
                                        <span>{user.role} Account</span>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-white/5">
                                    <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-400">
                                        <div className="h-8 w-8 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center">
                                            <Mail className="h-4 w-4" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email</span>
                                            <span className="text-sm font-medium">{user.email}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-400">
                                        <div className="h-8 w-8 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center">
                                            <User className="h-4 w-4" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">User ID</span>
                                            <span className="text-[10px] font-mono opacity-60 uppercase">{user._id}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-10">
                                    <Button
                                        onClick={handleLogout}
                                        variant="outline"
                                        className="w-full h-12 rounded-xl text-red-500 border-red-100 bg-red-50 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all font-bold uppercase tracking-widest text-[10px]"
                                    >
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Sign Out Account
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Right Column: Account Management */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-2 space-y-8"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {menuItems.map((item, idx) => (
                                <Card key={item.label} className="group rounded-[32px] border-none shadow-premium hover:shadow-2xl transition-all bg-white dark:bg-slate-900 cursor-pointer overflow-hidden border border-transparent hover:border-primary-600/20">
                                    <CardContent className="p-8 flex items-start space-x-6">
                                        <div className="h-14 w-14 rounded-2xl bg-secondary-100 dark:bg-white/5 flex items-center justify-center text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-all duration-500">
                                            <item.icon className="h-6 w-6 stroke-[1.5px]" />
                                        </div>
                                        <div className="flex flex-col justify-center h-14">
                                            <h3 className="text-lg font-bold text-slate-950 dark:text-white mb-1 group-hover:text-primary-600 transition-colors uppercase tracking-tight">{item.label}</h3>
                                            <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Recent Activity Placeholder */}
                        <Card className="rounded-[40px] border-none shadow-premium bg-white dark:bg-slate-900 overflow-hidden">
                            <CardHeader className="p-10 pb-0 flex flex-row items-center justify-between">
                                <CardTitle className="text-xl font-bold uppercase tracking-tight text-slate-950 dark:text-white">Recent Purchases</CardTitle>
                                <Button variant="ghost" className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-600">View All Account History</Button>
                            </CardHeader>
                            <CardContent className="p-10 pt-8">
                                <div className="flex flex-col items-center justify-center py-20 bg-slate-50 dark:bg-white/5 rounded-[32px] border-2 border-dashed border-slate-200 dark:border-white/10">
                                    <Package className="h-12 w-12 text-slate-300 mb-4 stroke-[1px]" />
                                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">No recent purchase data found</p>
                                    <p className="text-[10px] text-slate-400 mt-2 uppercase">Ready to start curation?</p>
                                    <Button asChild variant="link" className="mt-4 text-primary-600 font-black h-auto p-0 uppercase tracking-widest text-[10px]">
                                        <a href="/shop">Explore Collections</a>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
