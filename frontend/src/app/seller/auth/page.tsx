'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronDown, ChevronUp, ExternalLink, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export default function SellerAuthPage() {
    const [inputValue, setInputValue] = useState('');
    const [showHelp, setShowHelp] = useState(false);

    const handleContinue = () => {
        // Logic to determine if user exists and redirect
        // For now, we redirect to registration as requested for new sellers
        window.location.href = `/seller/register?identity=${encodeURIComponent(inputValue)}`;
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center pt-8 pb-12 font-sans selection:bg-[#FEBD69]/30">
            {/* Amazon-style Seller Central Logo */}
            <div className="mb-6 flex flex-col items-center">
                <Link href="/" className="flex items-center gap-1">
                    <span className="text-2xl font-black text-slate-900 tracking-tighter">
                        Nexus<span className="text-primary-600">Store</span>
                    </span>
                    <div className="h-6 w-[1px] bg-slate-300 mx-1" />
                    <div className="flex flex-col leading-none">
                        <span className="text-xs font-bold text-slate-900">seller central</span>
                        <span className="text-[10px] text-slate-400 font-medium">India</span>
                    </div>
                </Link>
            </div>

            {/* Main Auth Card */}
            <Card className="w-full max-w-[350px] border border-slate-200 shadow-none rounded-lg overflow-hidden mb-6">
                <CardContent className="p-6">
                    <h1 className="text-2xl font-medium text-slate-900 mb-4">Sign-In</h1>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-900">
                                Enter mobile number or email
                            </label>
                            <Input
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                className="h-8 rounded-[3px] border-slate-400 focus-visible:ring-1 focus-visible:ring-[#007185] focus-visible:border-[#007185] shadow-inner"
                            />
                        </div>

                        <Button
                            onClick={handleContinue}
                            className="w-full h-8 bg-[#FFD814] hover:bg-[#F7CA00] text-slate-900 rounded-lg shadow-sm border border-[#FCD200] font-normal text-sm"
                        >
                            Continue
                        </Button>

                        <div className="pt-2">
                            <button
                                onClick={() => setShowHelp(!showHelp)}
                                className="flex items-center gap-1 text-xs text-[#007185] hover:text-[#C7511F] hover:underline transition-all"
                            >
                                {showHelp ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                                Need help?
                            </button>
                            {showHelp && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="mt-2 pl-4 space-y-2"
                                >
                                    <Link href="#" className="block text-xs text-[#007185] hover:text-[#C7511F] hover:underline">Forgot Password</Link>
                                    <Link href="#" className="block text-xs text-[#007185] hover:text-[#C7511F] hover:underline">Other issues with Sign-In</Link>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Divider */}
            <div className="w-full max-w-[350px] relative mb-4">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-[11px]">
                    <span className="bg-white px-2 text-slate-500">New to NexusStore?</span>
                </div>
            </div>

            {/* Create Account Button */}
            <Button
                variant="outline"
                asChild
                className="w-full max-w-[350px] h-8 rounded-lg border-slate-300 bg-white hover:bg-slate-50 shadow-sm text-sm font-normal text-slate-900 py-0"
            >
                <Link href="/seller/register">Create your NexusStore account</Link>
            </Button>

            {/* Footer */}
            <div className="mt-12 w-full max-w-[500px] border-t border-slate-100 pt-8 text-center">
                <div className="flex justify-center gap-8 mb-4">
                    <Link href="#" className="text-[11px] text-[#007185] hover:underline">Conditions of Use</Link>
                    <Link href="#" className="text-[11px] text-[#007185] hover:underline">Privacy Notice</Link>
                    <Link href="#" className="text-[11px] text-[#007185] hover:underline">Help</Link>
                </div>
                <p className="text-[11px] text-slate-500">
                    © 1996-2026, NexusStore.com, Inc. or its affiliates
                </p>
            </div>
        </div>
    );
}
