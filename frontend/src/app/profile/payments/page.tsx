'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CreditCard, Plus, Lock, CheckCircle2, MoreVertical, Smartphone, X, Wallet, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const LOGOS = {
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
                logo: (LOGOS as any)[formDetails.upiProvider]
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
                logo: (LOGOS as any)[formDetails.walletProvider]
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
                                        <div className="h-10 w-16 bg-white rounded-lg flex items-center justify-center p-2 shadow-sm border border-slate-100 dark:border-white/5 overflow-hidden">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={p.logo} alt={p.type} className="h-full object-contain" />
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

                    {/* Adding UI */}
                    <AnimatePresence mode="wait">
                        {isAdding ? (
                            <motion.div
                                key="add-form-container"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                            >
                                <Card className="relative rounded-[24px] shadow-premium bg-white dark:bg-slate-900 border-2 border-primary-500 w-full min-h-[320px]">
                                    <div className="absolute top-4 right-4">
                                        <Button variant="ghost" size="icon" onClick={() => setIsAdding(false)} className="h-8 w-8 rounded-full">
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <CardContent className="p-8">
                                        <div className="flex space-x-1 mb-6 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                                            {(['card', 'upi', 'wallet'] as const).map(cat => (
                                                <button
                                                    key={cat}
                                                    onClick={() => setAddCategory(cat)}
                                                    className={`flex-1 py-2 px-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${addCategory === cat ? 'bg-white dark:bg-slate-700 shadow-sm text-primary-600' : 'text-slate-400'}`}
                                                >
                                                    {cat}
                                                </button>
                                            ))}
                                        </div>

                                        <form onSubmit={handleSave} className="space-y-4">
                                            {addCategory === 'card' && (
                                                <div className="space-y-4">
                                                    <Input
                                                        placeholder="Card Number (16 digits)"
                                                        value={formDetails.number}
                                                        onChange={(e) => setFormDetails({ ...formDetails, number: e.target.value.replace(/\D/g, '') })}
                                                        maxLength={16}
                                                        className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 font-mono tracking-widest h-12 rounded-xl"
                                                        required
                                                    />
                                                    <div className="flex gap-4">
                                                        <Input
                                                            placeholder="MM/YY"
                                                            value={formDetails.expiry}
                                                            onChange={(e) => setFormDetails({ ...formDetails, expiry: e.target.value })}
                                                            maxLength={5}
                                                            className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 font-mono tracking-widest w-1/2 h-12 rounded-xl"
                                                            required
                                                        />
                                                        <Input
                                                            placeholder="CVC"
                                                            type="password"
                                                            value={formDetails.cvc}
                                                            onChange={(e) => setFormDetails({ ...formDetails, cvc: e.target.value.replace(/\D/g, '') })}
                                                            maxLength={4}
                                                            className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 font-mono tracking-widest w-1/2 h-12 rounded-xl"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {addCategory === 'upi' && (
                                                <div className="space-y-4">
                                                    <div className="grid grid-cols-3 gap-2">
                                                        {['GPay', 'Paytm', 'PhonePe'].map(provider => (
                                                            <button
                                                                key={provider}
                                                                type="button"
                                                                onClick={() => setFormDetails({ ...formDetails, upiProvider: provider })}
                                                                className={`h-12 rounded-xl border-2 flex items-center justify-center px-2 transition-all ${formDetails.upiProvider === provider ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-slate-100 dark:border-white/5 bg-white dark:bg-slate-800/50'}`}
                                                            >
                                                                <img src={(LOGOS as any)[provider]} alt={provider} className="h-3 object-contain" />
                                                            </button>
                                                        ))}
                                                    </div>
                                                    <div className="relative">
                                                        <Input
                                                            placeholder="username@bank"
                                                            value={formDetails.upiId}
                                                            onChange={(e) => setFormDetails({ ...formDetails, upiId: e.target.value })}
                                                            className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 font-mono pl-11 h-12 rounded-xl"
                                                            required
                                                        />
                                                        <Smartphone className="absolute left-4 top-4 h-4 w-4 text-slate-400" />
                                                    </div>
                                                </div>
                                            )}

                                            {addCategory === 'wallet' && (
                                                <div className="space-y-4">
                                                    <div className="grid grid-cols-2 gap-3">
                                                        {['PayPal', 'ApplePay'].map(provider => (
                                                            <button
                                                                key={provider}
                                                                type="button"
                                                                onClick={() => setFormDetails({ ...formDetails, walletProvider: provider })}
                                                                className={`h-12 rounded-xl border-2 flex items-center justify-center p-2 transition-all ${formDetails.walletProvider === provider ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-slate-100 dark:border-white/5 bg-white dark:bg-slate-800/50'}`}
                                                            >
                                                                <img src={(LOGOS as any)[provider]} alt={provider} className="h-5 object-contain" />
                                                            </button>
                                                        ))}
                                                    </div>
                                                    <div className="relative">
                                                        <Input
                                                            placeholder="Account Email / Identifier"
                                                            type="text"
                                                            value={formDetails.walletEmail}
                                                            onChange={(e) => setFormDetails({ ...formDetails, walletEmail: e.target.value })}
                                                            className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 font-mono pl-11 h-12 rounded-xl"
                                                            required
                                                        />
                                                        <Mail className="absolute left-4 top-4 h-4 w-4 text-slate-400" />
                                                    </div>
                                                </div>
                                            )}

                                            <Button type="submit" className="w-full h-12 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold uppercase tracking-widest text-[10px] sm:mt-6 shadow-lg shadow-primary-500/20">
                                                Save {addCategory.toUpperCase()} Method
                                            </Button>
                                        </form>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="add-tile"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: payments.length * 0.1 }}
                            >
                                <button onClick={() => { setIsAdding(true); setAddCategory('card'); }} className="w-full h-full min-h-[220px] rounded-[24px] border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 hover:bg-slate-50 dark:hover:bg-slate-900 hover:border-primary-400 dark:hover:border-primary-600 transition-all flex flex-col items-center justify-center group p-8">
                                    <div className="h-16 w-16 rounded-full bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary-50 dark:group-hover:bg-primary-900/40 transition-all duration-300">
                                        <Plus className="h-8 w-8 text-slate-400 group-hover:text-primary-600" />
                                    </div>
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400 group-hover:text-primary-600">Add New Payment Method</h3>
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
