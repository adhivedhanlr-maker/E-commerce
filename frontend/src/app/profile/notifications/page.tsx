'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Bell, BellRing, Package, Tag, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

export default function NotificationsPage() {
    const [preferences, setPreferences] = useState({
        orderUpdates: true,
        promotions: false,
        security: true,
        newsletter: false
    });

    const togglePreference = (key: keyof typeof preferences) => {
        setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const NOTIFICATION_TYPES = [
        {
            id: 'orderUpdates',
            title: 'Order Updates',
            desc: 'Get instantly notified when your order status changes or is out for delivery.',
            icon: Package,
            color: 'text-blue-500',
            bg: 'bg-blue-50 dark:bg-blue-900/20'
        },
        {
            id: 'promotions',
            title: 'Exclusive Promotions',
            desc: 'Receive alerts about flash sales, special discounts, and new arrivals.',
            icon: Tag,
            color: 'text-amber-500',
            bg: 'bg-amber-50 dark:bg-amber-900/20'
        },
        {
            id: 'security',
            title: 'Security Alerts',
            desc: 'Important notifications about your account security and login attempts.',
            icon: ShieldAlert,
            color: 'text-red-500',
            bg: 'bg-red-50 dark:bg-red-900/20'
        },
        {
            id: 'newsletter',
            title: 'Weekly Newsletter',
            desc: 'Our curated weekly digest of the best products and journal articles.',
            icon: BellRing,
            color: 'text-primary-600',
            bg: 'bg-primary-50 dark:bg-primary-900/20'
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 pb-24">
            <div className="mx-auto max-w-4xl px-6 lg:px-12">
                <div className="mb-8">
                    <Link href="/profile" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-primary-600 transition-colors mb-6">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Profile
                    </Link>
                    <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600">
                            <Bell className="h-6 w-6 stroke-[1.5px]" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black uppercase tracking-tight text-slate-950 dark:text-white">Notifications</h1>
                            <p className="text-sm text-slate-500 mt-1">Configure your email and push alert preferences</p>
                        </div>
                    </div>
                </div>

                <Card className="rounded-[32px] border-none shadow-premium bg-white dark:bg-slate-900 overflow-hidden">
                    <CardContent className="p-0">
                        <div className="flex flex-col">
                            {NOTIFICATION_TYPES.map((type, index) => {
                                const isEnabled = preferences[type.id as keyof typeof preferences];

                                return (
                                    <motion.div
                                        key={type.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className={`flex items-start justify-between p-8 sm:p-10 transition-colors ${index !== NOTIFICATION_TYPES.length - 1 ? 'border-b border-slate-100 dark:border-white/5' : ''
                                            } hover:bg-slate-50/50 dark:hover:bg-slate-800/30`}
                                    >
                                        <div className="flex items-start space-x-6 pr-8">
                                            <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 ${type.bg} ${type.color}`}>
                                                <type.icon className="h-6 w-6 stroke-[1.5px]" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-950 dark:text-white mb-2 uppercase tracking-wide">{type.title}</h3>
                                                <p className="text-sm text-slate-500 leading-relaxed max-w-md">{type.desc}</p>
                                            </div>
                                        </div>
                                        <div className="pt-2">
                                            <Switch
                                                checked={isEnabled}
                                                onCheckedChange={() => togglePreference(type.id as keyof typeof preferences)}
                                                className="data-[state=checked]:bg-primary-600"
                                            />
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-900/50 p-8 sm:p-10 border-t border-slate-100 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
                            <div>
                                <p className="text-sm font-bold text-slate-950 dark:text-white uppercase tracking-widest">Unsubscribe from all</p>
                                <p className="text-xs text-slate-500 mt-1">Turn off all non-essential notifications</p>
                            </div>
                            <Button variant="outline" className="h-10 rounded-xl font-bold uppercase tracking-widest text-[10px] w-full sm:w-auto" onClick={() => alert("Advanced settings will be available in the next app update.")}>
                                Manage Advanced Settings
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
