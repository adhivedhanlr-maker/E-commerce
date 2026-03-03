'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CreditCard, Plus, Lock, CheckCircle2, MoreVertical, Smartphone, X, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const LOGOS: Record<string, string> = {
    Visa: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png',
    Mastercard: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png',
    GPay: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Google_Pay_Logo_%282020%29.svg/2560px-Google_Pay_Logo_%282020%29.svg.png',
    Paytm: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Paytm_Logo_%28standalone%29.svg/2560px-Paytm_Logo_%28standalone%29.svg.png',
    PhonePe: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/PhonePe_Logo.svg/1280px-PhonePe_Logo.svg.png',
    PayPal: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/1200px-PayPal.svg.png',
    ApplePay: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Apple_Pay_logo.svg/2560px-Apple_Pay_logo.svg.png'
};

interface PaymentItem {
    id: string;
    method: 'card' | 'upi' | 'wallet';
    type: string;
    last4?: string;
    expiry?: string;
    upiId?: string;
    email?: string;
    isDefault: boolean;
    logo: string;
}

const DEMO_PAYMENTS: PaymentItem[] = [
    {
        id: 'pay-1',
        method: 'card',
        type: 'Visa',
        last4: '4242',
        expiry: '12/28',
        isDefault: true,
        logo: LOGOS.Visa
    },
    {
        id: 'pay-2',
        method: 'upi',
        type: 'GPay',
        upiId: 'alex.smith@okaxis',
        isDefault: false,
        logo: LOGOS.GPay
    },
    {
        id: 'pay-3',
        method: 'wallet',
        type: 'PayPal',
        email: 'alex.design@gmail.com',
        isDefault: false,
        logo: LOGOS.PayPal
    }
];

export default function PaymentsPage() {
    const [payments, setPayments] = useState<PaymentItem[]>(DEMO_PAYMENTS);
    const [isAdding, setIsAdding] = useState(false);
    const [addCategory, setAddCategory] = useState<'card' | 'upi' | 'wallet'>('card');
    const [formDetails, setFormDetails] = useState({
        number: '',
        expiry: '',
        cvc: '',
        upiId: '',
        upiProvider: 'GPay',
        walletEmail: '',
        walletProvider: 'PayPal'
    });

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();

        let newItem: PaymentItem;

        if (addCategory === 'card') {
            if (!formDetails.number || !formDetails.expiry || !formDetails.cvc) {
                alert("Please fill in all card details.");
                return;
            }
            const last4 = formDetails.number.slice(-4);
            const isMastercard = formDetails.number.startsWith('5');
            newItem = {
                id: `pay-${Math.random()}`,
                method: 'card',
                type: isMastercard ? 'Mastercard' : 'Visa',
                last4,
                expiry: formDetails.expiry,
                isDefault: payments.length === 0,
                logo: isMastercard ? LOGOS.Mastercard : LOGOS.Visa
            };
        } else if (addCategory === 'upi') {
            if (!formDetails.upiId) {
                alert("Please enter a valid UPI ID.");
                return;
            }
            newItem = {
                id: `pay-${Math.random()}`,
                method: 'upi',
                type: formDetails.upiProvider,
                upiId: formDetails.upiId,
                isDefault: payments.length === 0,
                logo: LOGOS[formDetails.upiProvider]
            };
        } else {
            if (!formDetails.walletEmail) {
                alert("Please enter a valid wallet identifier (email/ID).");
                return;
            }
            newItem = {
                id: `pay-${Math.random()}`,
                method: 'wallet',
                type: formDetails.walletProvider,
                email: formDetails.walletEmail,
                isDefault: payments.length === 0,
                logo: LOGOS[formDetails.walletProvider]
            };
        }

        setPayments([...payments, newItem]);
        setIsAdding(false);
        setFormDetails({
            number: '', expiry: '', cvc: '',
            upiId: '', upiProvider: 'GPay',
            walletEmail: '', walletProvider: 'PayPal'
        });
        alert("Payment method added successfully!");
    };

    const handleMakeDefault = (id: string) => {
        setPayments(payments.map(p => ({ ...p, isDefault: p.id === id })));
    };

    const handleDelete = (id: string) => {
        setPayments(payments.filter(p => p.id !== id));
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 pb-24">
            <div className="mx-auto max-w-4xl px-6 lg:px-12">
                <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <Link href="/profile" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-primary-600 transition-colors mb-6">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Profile
                        </Link>
                        <div className="flex items-center space-x-4">
                            <div className="h-12 w-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600">
                                <CreditCard className="h-6 w-6 stroke-[1.5px]" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-black uppercase tracking-tight text-slate-950 dark:text-white">Payment Methods</h1>
                                <p className="text-sm text-slate-500 mt-1 flex items-center">
                                    <Lock className="h-3.5 w-3.5 mr-1.5 opacity-70" />
                                    Securely manage your saved methods
                                </p>
                            </div>
                        </div>
                    </div>

                    <Button onClick={() => { setIsAdding(true); setAddCategory('card'); }} className="h-12 px-6 rounded-xl font-bold uppercase tracking-widest text-xs bg-primary-600 hover:bg-primary-700 text-white shadow-xl shadow-primary-500/20 transition-all">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Payment Method
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {payments.map((p, index) => (
                        <motion.div
                            key={p.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className={`relative rounded-[24px] overflow-hidden shadow-premium bg-white dark:bg-slate-900 transition-all border-2 ${p.isDefault ? 'border-primary-500 dark:border-primary-600' : 'border-transparent hover:border-slate-200 dark:hover:border-white/10'}`}>
                                {p.isDefault && (
                                    <div className="absolute top-4 right-4 flex items-center space-x-1.5 px-2.5 py-1 bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-400 rounded-full text-[10px] font-black uppercase tracking-widest">
                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                        <span>Default</span>
                                    </div>
                                )}
                                <CardContent className="p-8">
                                    <div className="flex items-between mb-8">
                                        <div className="h-10 w-16 bg-white rounded-lg flex items-center justify-center p-2 shadow-sm border border-slate-100 dark:border-white/5 overflow-hidden relative">
                                            <Image src={p.logo} alt={p.type} fill className="object-contain p-2" />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {p.method === 'card' ? (
                                            <div className="font-mono text-xl text-slate-700 dark:text-slate-300 tracking-widest flex items-center space-x-4">
                                                <span>••••</span>
                                                <span>••••</span>
                                                <span className="text-slate-950 dark:text-white font-bold">{p.last4}</span>
                                            </div>
                                        ) : p.method === 'upi' ? (
                                            <div className="font-mono text-sm text-slate-700 dark:text-slate-300 tracking-tight flex flex-col">
                                                <span className="text-[10px] uppercase font-black text-slate-400 mb-1">UPI ID</span>
                                                <span className="text-slate-950 dark:text-white font-bold truncate">{p.upiId}</span>
                                            </div>
                                        ) : (
                                            <div className="font-mono text-sm text-slate-700 dark:text-slate-300 tracking-tight flex flex-col">
                                                <span className="text-[10px] uppercase font-black text-slate-400 mb-1">Account</span>
                                                <span className="text-slate-950 dark:text-white font-bold truncate">{p.email}</span>
                                            </div>
                                        )}

                                        <div className="flex justify-between items-end">
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                                                    {p.method === 'card' ? 'Expires' : 'Provider'}
                                                </p>
                                                <p className="text-sm font-bold text-slate-950 dark:text-white">
                                                    {p.method === 'card' ? p.expiry : p.type}
                                                </p>
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-[160px]">
                                                    <DropdownMenuItem onClick={() => handleMakeDefault(p.id)} disabled={p.isDefault}>
                                                        Make Default
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleDelete(p.id)} className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950 cursor-pointer">
                                                        Delete Method
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}

                    {/* Modal Backdrop & Popup */}
                    <AnimatePresence>
                        {isAdding && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                                {/* Animated Backdrop */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => setIsAdding(false)}
                                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                                />

                                {/* Modal Container */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                                    className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl overflow-hidden border border-white/20 dark:border-slate-800"
                                >
                                    <div className="absolute top-6 right-6 z-10">
                                        <Button variant="ghost" size="icon" onClick={() => setIsAdding(false)} className="h-10 w-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                                            <X className="h-5 w-5" />
                                        </Button>
                                    </div>

                                    <CardContent className="p-10 pt-12">
                                        <div className="mb-8">
                                            <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white mb-2">New Payment Method</h2>
                                            <p className="text-sm text-slate-500 font-medium">Choose a category and enter your details to continue.</p>
                                        </div>

                                        <div className="flex space-x-1 mb-8 p-1.5 bg-slate-100 dark:bg-slate-800/50 rounded-2xl">
                                            {(['card', 'upi', 'wallet'] as const).map(cat => (
                                                <button
                                                    key={cat}
                                                    type="button"
                                                    onClick={() => setAddCategory(cat)}
                                                    className={`flex-1 py-3 px-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${addCategory === cat ? 'bg-white dark:bg-slate-700 shadow-premium text-primary-600' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                                                >
                                                    {cat}
                                                </button>
                                            ))}
                                        </div>

                                        <form onSubmit={handleSave} className="space-y-6">
                                            {addCategory === 'card' && (
                                                <div className="space-y-4">
                                                    <div className="space-y-1.5">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Card Details</label>
                                                        <Input
                                                            placeholder="Card Number (16 digits)"
                                                            value={formDetails.number}
                                                            onChange={(e) => setFormDetails({ ...formDetails, number: e.target.value.replace(/\D/g, '') })}
                                                            maxLength={16}
                                                            className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 font-mono tracking-[0.2em] h-14 rounded-2xl focus:ring-primary-500/20"
                                                            required
                                                        />
                                                    </div>
                                                    <div className="flex gap-4">
                                                        <Input
                                                            placeholder="MM/YY"
                                                            value={formDetails.expiry}
                                                            onChange={(e) => setFormDetails({ ...formDetails, expiry: e.target.value })}
                                                            maxLength={5}
                                                            className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 font-mono tracking-widest w-1/2 h-14 rounded-2xl focus:ring-primary-500/20"
                                                            required
                                                        />
                                                        <Input
                                                            placeholder="CVC"
                                                            type="password"
                                                            value={formDetails.cvc}
                                                            onChange={(e) => setFormDetails({ ...formDetails, cvc: e.target.value.replace(/\D/g, '') })}
                                                            maxLength={4}
                                                            className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 font-mono tracking-widest w-1/2 h-14 rounded-2xl focus:ring-primary-500/20"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {addCategory === 'upi' && (
                                                <div className="space-y-6">
                                                    <div className="grid grid-cols-3 gap-3">
                                                        {['GPay', 'Paytm', 'PhonePe'].map(provider => (
                                                            <button
                                                                key={provider}
                                                                type="button"
                                                                onClick={() => setFormDetails({ ...formDetails, upiProvider: provider })}
                                                                className={`h-16 rounded-2xl border-2 flex items-center justify-center px-4 transition-all duration-300 relative overflow-hidden ${formDetails.upiProvider === provider ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/20' : 'border-slate-100 dark:border-white/5 bg-white dark:bg-slate-800/50 hover:border-slate-200'}`}
                                                            >
                                                                <div className="relative h-4 w-full">
                                                                    <Image src={LOGOS[provider]} alt={provider} fill className="object-contain" />
                                                                </div>
                                                            </button>
                                                        ))}
                                                    </div>
                                                    <div className="space-y-1.5 text-left">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">UPI Identifier</label>
                                                        <div className="relative">
                                                            <Input
                                                                placeholder="username@bank"
                                                                value={formDetails.upiId}
                                                                onChange={(e) => setFormDetails({ ...formDetails, upiId: e.target.value })}
                                                                className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 font-mono pl-12 h-14 rounded-2xl focus:ring-primary-500/20"
                                                                required
                                                            />
                                                            <Smartphone className="absolute left-4 top-5 h-4 w-4 text-slate-400" />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {addCategory === 'wallet' && (
                                                <div className="space-y-6">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        {['PayPal', 'ApplePay'].map(provider => (
                                                            <button
                                                                key={provider}
                                                                type="button"
                                                                onClick={() => setFormDetails({ ...formDetails, walletProvider: provider })}
                                                                className={`h-16 rounded-2xl border-2 flex items-center justify-center p-4 transition-all duration-300 relative overflow-hidden ${formDetails.walletProvider === provider ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/20' : 'border-slate-100 dark:border-white/5 bg-white dark:bg-slate-800/50 hover:border-slate-200'}`}
                                                            >
                                                                <div className="relative h-6 w-full">
                                                                    <Image src={LOGOS[provider]} alt={provider} fill className="object-contain" />
                                                                </div>
                                                            </button>
                                                        ))}
                                                    </div>
                                                    <div className="space-y-1.5 text-left">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Account Identifier</label>
                                                        <div className="relative">
                                                            <Input
                                                                placeholder="Email / Phone / Username"
                                                                type="text"
                                                                value={formDetails.walletEmail}
                                                                onChange={(e) => setFormDetails({ ...formDetails, walletEmail: e.target.value })}
                                                                className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 font-mono pl-12 h-14 rounded-2xl focus:ring-primary-500/20"
                                                                required
                                                            />
                                                            <Mail className="absolute left-4 top-5 h-4 w-4 text-slate-400" />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="pt-4">
                                                <Button type="submit" className="w-full h-14 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-primary-500/30 transition-all hover:scale-[1.02] active:scale-95">
                                                    Confirm & Register Method
                                                </Button>
                                                <p className="text-[9px] text-center text-slate-400 font-bold uppercase tracking-widest mt-6 flex items-center justify-center gap-2">
                                                    <Lock className="h-3 w-3" />
                                                    End-to-End Encrypted Secure Registration
                                                </p>
                                            </div>
                                        </form>
                                    </CardContent>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
