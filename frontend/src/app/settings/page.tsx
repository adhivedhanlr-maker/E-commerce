'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Settings, User, Mail, Shield, Smartphone, Key, MapPin } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/store/useAuth';
import axios from 'axios';

export default function SettingsPage() {
    const { user, setUser } = useAuth();
    const [name, setName] = React.useState(user?.name || '');
    const [avatar] = React.useState(user?.avatar || '');
    const [isSaving, setIsSaving] = React.useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const token = localStorage.getItem('accessToken');
            const response = await axios.put(
                `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/profile`,
                { name, avatar },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.data.success) {
                setUser({ ...user!, name, avatar });
                alert("Profile updated successfully!");
            }
        } catch (error: unknown) {
            console.error('Error updating profile:', error);
            const err = error as { response?: { data?: { message?: string } }; message?: string };
            alert(err.response?.data?.message || err.message || "Failed to update profile");
        } finally {
            setIsSaving(false);
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-16 pb-24">
            <div className="mx-auto max-w-4xl px-6 lg:px-12">
                <div className="mb-8">
                    <Link href="/profile" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-primary-600 transition-colors mb-6">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Profile
                    </Link>
                    <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600">
                            <Settings className="h-6 w-6 stroke-[1.5px]" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black uppercase tracking-tight text-slate-950 dark:text-white">Account Settings</h1>
                            <p className="text-sm text-slate-500 mt-1">Manage your personal details and security</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Personal Information */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <Card className="rounded-[32px] border-none shadow-premium bg-white dark:bg-slate-900 overflow-hidden">
                            <div className="px-8 py-6 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/50">
                                <h2 className="text-lg font-bold uppercase tracking-tight text-slate-950 dark:text-white flex items-center">
                                    <User className="mr-3 h-5 w-5 text-primary-600" />
                                    Personal Information
                                </h2>
                            </div>
                            <CardContent className="p-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4 md:col-span-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Profile Picture (Auto-linked to Email)</label>
                                        <div className="flex items-center space-x-6">
                                            <div className="h-20 w-20 rounded-2xl bg-slate-900 flex-shrink-0 overflow-hidden border-2 border-slate-100 dark:border-white/5 shadow-inner relative">
                                                {avatar ? (
                                                    <Image src={avatar} alt="Preview" fill className="object-cover" sizes="80px" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-white font-bold text-2xl uppercase">
                                                        {name.charAt(0)}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-slate-900 dark:text-white mb-1">Automatic Profile Sync</p>
                                                <p className="text-xs text-slate-500 italic">
                                                    Your profile photo is automatically fetched from Google or Gravatar based on your email address.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                                        <Input
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="h-12 rounded-xl border-slate-200 bg-slate-50/50 dark:bg-slate-950/50 dark:border-white/5"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                                        <div className="relative">
                                            <Input defaultValue={user.email} disabled className="h-12 rounded-xl border-slate-200 bg-slate-100 dark:bg-slate-800 dark:border-white/5 text-slate-500 cursor-not-allowed pl-11" />
                                            <Mail className="absolute left-4 top-4 h-4 w-4 text-slate-400" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Phone Number</label>
                                        <div className="relative">
                                            <Input placeholder="+1 (555) 000-0000" className="h-12 rounded-xl border-slate-200 bg-slate-50/50 dark:bg-slate-950/50 dark:border-white/5 pl-11" />
                                            <Smartphone className="absolute left-4 top-4 h-4 w-4 text-slate-400" />
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/5 flex justify-end">
                                    <Button
                                        disabled={isSaving}
                                        className="h-12 px-8 rounded-xl font-bold uppercase tracking-widest text-xs bg-primary-600 hover:bg-primary-700 text-white shadow-xl shadow-primary-500/20 transition-all"
                                        onClick={handleSave}
                                    >
                                        {isSaving ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Security & Password */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <Card className="rounded-[32px] border-none shadow-premium bg-white dark:bg-slate-900 overflow-hidden">
                            <div className="px-8 py-6 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/50">
                                <h2 className="text-lg font-bold uppercase tracking-tight text-slate-950 dark:text-white flex items-center">
                                    <Shield className="mr-3 h-5 w-5 text-primary-600" />
                                    Security & Defaults
                                </h2>
                            </div>
                            <CardContent className="p-8">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 rounded-2xl border border-slate-100 dark:border-white/5 hover:border-primary-200 dark:hover:border-primary-900/50 transition-colors bg-slate-50/50 dark:bg-slate-900/30">
                                    <div className="flex items-center space-x-5 mb-4 sm:mb-0">
                                        <div className="h-12 w-12 rounded-xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-slate-600 dark:text-slate-400">
                                            <Key className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-950 dark:text-white">Change Password</h3>
                                            <p className="text-xs text-slate-500 mt-1">Update your password to keep your account secure</p>
                                        </div>
                                    </div>
                                    <Button variant="outline" className="h-10 px-6 rounded-xl font-bold uppercase tracking-widest text-[10px] w-full sm:w-auto" onClick={() => alert("Change password flow will be triggered here.")}>
                                        Update
                                    </Button>
                                </div>

                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 rounded-2xl border border-slate-100 dark:border-white/5 hover:border-primary-200 dark:hover:border-primary-900/50 transition-colors bg-slate-50/50 dark:bg-slate-900/30 mt-4">
                                    <div className="flex items-center space-x-5 mb-4 sm:mb-0">
                                        <div className="h-12 w-12 rounded-xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-slate-600 dark:text-slate-400">
                                            <MapPin className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-950 dark:text-white">Shipping Addresses</h3>
                                            <p className="text-xs text-slate-500 mt-1">Manage delivery locations for faster checkout</p>
                                        </div>
                                    </div>
                                    <Button variant="outline" className="h-10 px-6 rounded-xl font-bold uppercase tracking-widest text-[10px] w-full sm:w-auto" onClick={() => alert("Manage shipping addresses.")}>
                                        Manage
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
