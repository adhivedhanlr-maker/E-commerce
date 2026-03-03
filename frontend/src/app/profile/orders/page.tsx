'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Package, ArrowLeft, Clock, CheckCircle2, ChevronRight, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/store/useCart';

// Dummy data for orders until backend integration is ready
const DEMO_ORDERS = [
    {
        id: 'ORD-7392-B8X',
        date: 'Oct 24, 2026',
        status: 'Delivered',
        total: 1299.00,
        items: [
            { name: 'Sony WH-1000XM5 Wireless Headphones', qty: 1, price: 1299.00, img: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=200' }
        ]
    },
    {
        id: 'ORD-1049-M2Q',
        date: 'Sep 12, 2026',
        status: 'Processing',
        total: 245.50,
        items: [
            { name: 'Minimalist Ceramic Coffee Mug', qty: 2, price: 45.00, img: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&q=80&w=200' },
            { name: 'Artisan Roasted Coffee Beans', qty: 1, price: 155.50, img: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&q=80&w=200' }
        ]
    }
];

export default function OrdersPage() {
    const { addItem } = useCart();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 pb-24">
            <div className="mx-auto max-w-5xl px-6 lg:px-12">
                <div className="mb-8">
                    <Link href="/profile" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-primary-600 transition-colors mb-6">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Profile
                    </Link>
                    <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600">
                            <Package className="h-6 w-6 stroke-[1.5px]" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black uppercase tracking-tight text-slate-950 dark:text-white">My Orders</h1>
                            <p className="text-sm text-slate-500 mt-1">Track and manage your recent purchases</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {DEMO_ORDERS.length > 0 ? (
                        DEMO_ORDERS.map((order, index) => (
                            <motion.div
                                key={order.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="rounded-[24px] overflow-hidden border-none shadow-premium bg-white dark:bg-slate-900 hover:shadow-2xl transition-shadow duration-300">
                                    <div className="px-6 py-4 border-b border-slate-100 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between bg-slate-50/50 dark:bg-slate-900/50 gap-4">
                                        <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Order ID</p>
                                                <p className="text-sm font-bold text-slate-950 dark:text-white">{order.id}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Order Date</p>
                                                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{order.date}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Amount</p>
                                                <p className="text-sm font-bold text-primary-600">₹{order.total.toFixed(2)}</p>
                                            </div>
                                        </div>

                                        <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${order.status === 'Delivered'
                                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                            }`}>
                                            {order.status === 'Delivered' ? <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" /> : <Clock className="mr-1.5 h-3.5 w-3.5" />}
                                            {order.status}
                                        </div>
                                    </div>

                                    <CardContent className="p-6">
                                        <div className="space-y-4">
                                            {order.items.map((item, itemIdx) => (
                                                <div key={itemIdx} className="flex items-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-white/5">
                                                    <div className="h-16 w-16 rounded-xl overflow-hidden bg-slate-200 shrink-0">
                                                        <img src={item.img} alt={item.name} className="h-full w-full object-cover" />
                                                    </div>
                                                    <div className="ml-4 flex-1 overflow-hidden">
                                                        <p className="text-sm font-bold text-slate-950 dark:text-white truncate">{item.name}</p>
                                                        <p className="text-xs text-slate-500 mt-1">Qty: {item.qty} × ₹{item.price.toFixed(2)}</p>
                                                    </div>
                                                    <div className="ml-4 text-right hidden sm:block">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="rounded-full text-[10px] font-bold uppercase tracking-widest h-8 px-4"
                                                            onClick={() => {
                                                                addItem({
                                                                    _id: Math.random().toString(),
                                                                    name: item.name,
                                                                    price: item.price,
                                                                    image: item.img,
                                                                    qty: 1,
                                                                    countInStock: 10
                                                                });
                                                                alert(`${item.name} has been added to your cart!`);
                                                            }}
                                                        >
                                                            Buy Again
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                                            <div className="flex items-center text-sm text-slate-500 font-medium">
                                                <Truck className="mr-2 h-4 w-4 text-primary-500" />
                                                {order.status === 'Delivered' ? 'Delivered successfully' : 'Expected delivery in 2-3 days'}
                                            </div>
                                            <Button variant="ghost" className="text-xs font-bold uppercase tracking-widest text-primary-600 hover:text-primary-700 group h-auto p-0" onClick={() => alert(`Order details for ${order.id} will be available when the backend is connected!`)}>
                                                View Order Details
                                                <ChevronRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))
                    ) : (
                        <Card className="rounded-[32px] border-none shadow-premium bg-white dark:bg-slate-900 overflow-hidden">
                            <CardContent className="p-16 flex flex-col items-center text-center">
                                <div className="h-24 w-24 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-6">
                                    <Package className="h-10 w-10 text-slate-300 dark:text-slate-600 stroke-[1px]" />
                                </div>
                                <h3 className="text-xl font-bold uppercase tracking-tight text-slate-950 dark:text-white mb-2">No Orders Yet</h3>
                                <p className="text-sm text-slate-500 max-w-md mb-8">When you buy products, your orders will appear here. Start shopping to fill this space.</p>
                                <Button asChild className="h-12 px-8 rounded-xl font-bold uppercase tracking-widest text-xs bg-primary-600 hover:bg-primary-700 text-white shadow-xl shadow-primary-500/20 transition-all">
                                    <Link href="/shop">Start Shopping</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
