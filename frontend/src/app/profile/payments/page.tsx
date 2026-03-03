'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, Plus, Lock, CheckCircle2, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const DEMO_CARDS = [
    {
        id: 'card-1',
        type: 'Visa',
        last4: '4242',
        expiry: '12/28',
        isDefault: true,
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png'
    },
    {
        id: 'card-2',
        type: 'Mastercard',
        last4: '8831',
        expiry: '08/27',
        isDefault: false,
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png'
    }
];

export default function PaymentsPage() {
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
                                    Securely manage your saved cards
                                </p>
                            </div>
                        </div>
                    </div>

                    <Button className="h-12 px-6 rounded-xl font-bold uppercase tracking-widest text-xs bg-primary-600 hover:bg-primary-700 text-white shadow-xl shadow-primary-500/20 transition-all">
                        <Plus className="mr-2 h-4 w-4" />
                        Add New Card
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {DEMO_CARDS.map((card, index) => (
                        <motion.div
                            key={card.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className={`relative rounded-[24px] overflow-hidden shadow-premium bg-white dark:bg-slate-900 transition-all border-2 ${card.isDefault ? 'border-primary-500 dark:border-primary-600' : 'border-transparent hover:border-slate-200 dark:hover:border-white/10'}`}>
                                {card.isDefault && (
                                    <div className="absolute top-4 right-4 flex items-center space-x-1.5 px-2.5 py-1 bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-400 rounded-full text-[10px] font-black uppercase tracking-widest">
                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                        <span>Default</span>
                                    </div>
                                )}
                                <CardContent className="p-8">
                                    <div className="flex items-between mb-8">
                                        <div className="h-10 w-16 bg-white rounded-lg flex items-center justify-center p-2 shadow-sm border border-slate-100 dark:border-white/5">
                                            <img src={card.logo} alt={card.type} className="h-full object-contain" />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="font-mono text-xl text-slate-700 dark:text-slate-300 tracking-widest flex items-center space-x-4">
                                            <span>••••</span>
                                            <span>••••</span>
                                            <span>••••</span>
                                            <span className="text-slate-950 dark:text-white font-bold">{card.last4}</span>
                                        </div>

                                        <div className="flex justify-between items-end">
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Expires</p>
                                                <p className="text-sm font-bold text-slate-950 dark:text-white">{card.expiry}</p>
                                            </div>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}

                    {/* Empty State / Add Card Tile */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: DEMO_CARDS.length * 0.1 }}
                    >
                        <button className="w-full h-full min-h-[220px] rounded-[24px] border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 hover:bg-slate-50 dark:hover:bg-slate-900 hover:border-primary-400 dark:hover:border-primary-600 transition-all flex flex-col items-center justify-center group p-8">
                            <div className="h-16 w-16 rounded-full bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary-50 dark:group-hover:bg-primary-900/40 transition-all duration-300">
                                <Plus className="h-8 w-8 text-slate-400 group-hover:text-primary-600" />
                            </div>
                            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400 group-hover:text-primary-600">Add New Payment Method</h3>
                        </button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
