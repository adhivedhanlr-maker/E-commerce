'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Package, ArrowLeft, Clock, CheckCircle2, ChevronRight, Truck, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/store/useCart';
import { orderService, Order } from '@/services/orderService';
import { format } from 'date-fns';

export default function OrdersPage() {
    const { addItem } = useCart();
    const router = useRouter();

    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const data = await orderService.getMyOrders();
                setOrders(data);
                setError(null);
            } catch (err: any) {
                console.error("Failed to fetch orders:", err);
                setError(err.response?.data?.message || 'Failed to load your orders.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const getStatusIcon = (status: string, isDelivered: boolean) => {
        if (isDelivered || status === 'delivered') return <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />;
        return <Clock className="mr-1.5 h-3.5 w-3.5" />;
    };

    const getStatusBadgeClass = (status: string, isDelivered: boolean) => {
        if (isDelivered || status === 'delivered') {
            return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
        }
        if (status === 'cancelled') {
            return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
        }
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
    };

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
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <RefreshCw className="h-8 w-8 text-primary-500 animate-spin" />
                        </div>
                    ) : error ? (
                        <Card className="rounded-[32px] border-none shadow-premium bg-white dark:bg-slate-900 overflow-hidden">
                            <CardContent className="p-16 flex flex-col items-center text-center">
                                <h3 className="text-xl font-bold text-red-500 mb-2">Error</h3>
                                <p className="text-sm text-slate-500 max-w-md">{error}</p>
                            </CardContent>
                        </Card>
                    ) : orders.length > 0 ? (
                        orders.map((order, index) => (
                            <motion.div
                                key={order._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="rounded-[24px] overflow-hidden border-none shadow-premium bg-white dark:bg-slate-900 hover:shadow-2xl transition-shadow duration-300">
                                    <div className="px-6 py-4 border-b border-slate-100 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between bg-slate-50/50 dark:bg-slate-900/50 gap-4">
                                        <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Order ID</p>
                                                <p className="text-sm font-bold text-slate-950 dark:text-white">{order._id.substring(0, 10).toUpperCase()}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Order Date</p>
                                                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                    {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Amount</p>
                                                <p className="text-sm font-bold text-primary-600">₹{order.totalPrice.toFixed(2)}</p>
                                            </div>
                                        </div>

                                        <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusBadgeClass(order.status, order.isDelivered)}`}>
                                            {getStatusIcon(order.status, order.isDelivered)}
                                            {order.isDelivered ? 'Delivered' : order.status}
                                        </div>
                                    </div>

                                    <CardContent className="p-6">
                                        <div className="space-y-4">
                                            {order.orderItems.map((item, itemIdx) => (
                                                <div key={itemIdx} className="flex items-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-white/5">
                                                    <div className="h-16 w-16 rounded-xl overflow-hidden bg-slate-200 shrink-0 border border-slate-200/50 dark:border-white/5">
                                                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
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
                                                                    _id: item.product,
                                                                    name: item.name,
                                                                    price: item.price,
                                                                    image: item.image,
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
                                                {order.isDelivered ? 'Delivered successfully' : 'Expected delivery in 2-3 days'}
                                            </div>
                                            <Button
                                                variant="ghost"
                                                className="text-xs font-bold uppercase tracking-widest text-primary-600 hover:text-primary-700 group h-auto p-0"
                                                onClick={() => router.push(`/profile/orders/${order._id}`)}
                                            >
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
