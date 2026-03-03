'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, Truck, MapPin, CreditCard, ChevronRight, CheckCircle2, Clock, CalendarDays, ExternalLink, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/store/useCart';
import { orderService, Order } from '@/services/orderService';

export default function OrderDetailsPage() {
    const params = useParams();
    const orderId = params.id as string;
    const { addItem } = useCart();

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                setLoading(true);
                const data = await orderService.getOrderById(orderId);
                setOrder(data);
                setError(null);
            } catch (err: any) {
                console.error("Failed to fetch order details:", err);
                setError(err.response?.data?.message || 'Failed to load order details.');
            } finally {
                setLoading(false);
            }
        };

        if (orderId) {
            fetchOrderDetails();
        }
    }, [orderId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 pb-24 flex items-center justify-center">
                <RefreshCw className="h-8 w-8 text-primary-500 animate-spin" />
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 pb-24 text-center">
                <h1 className="text-2xl font-bold">{error || 'Order Not Found'}</h1>
                <Link href="/profile/orders" className="text-primary-600 mt-4 inline-block">Return to Orders</Link>
            </div>
        );
    }

    const { status, isDelivered, createdAt, isPaid, paidAt, orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice } = order;

    // Derived variables for display
    const orderDateFormatted = new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).format(new Date(createdAt));
    const orderTimeFormatted = new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).format(new Date(createdAt));

    const formatDateTimeShort = (date: string | number | Date) => new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(date));

    // Generate simplified tracking based on DB state
    const tracking = [
        { step: 'Order Placed', date: formatDateTimeShort(createdAt), completed: true },
        { step: 'Payment Confirmed', date: isPaid && paidAt ? formatDateTimeShort(paidAt) : 'Pending', completed: isPaid },
        { step: 'Processing', date: (status === 'processing' || status === 'shipped' || status === 'delivered') ? 'Started' : 'Pending', completed: status === 'processing' || status === 'shipped' || status === 'delivered' },
        { step: 'Shipped', date: (status === 'shipped' || status === 'delivered') ? 'In Transit' : 'Pending', completed: status === 'shipped' || status === 'delivered' || isDelivered },
        { step: 'Delivered', date: isDelivered ? formatDateTimeShort(order.deliveredAt || Date.now()) : 'Pending', completed: isDelivered || status === 'delivered' }
    ];

    const getStatusIcon = (st: string, delivered: boolean) => {
        if (delivered || st === 'delivered') return <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />;
        return <Clock className="mr-1.5 h-3.5 w-3.5" />;
    };

    const getStatusBadgeClass = (st: string, delivered: boolean) => {
        if (delivered || st === 'delivered') {
            return 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400';
        }
        if (st === 'cancelled') {
            return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400';
        }
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400';
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 pb-24">
            <div className="mx-auto max-w-5xl px-6 lg:px-12">
                <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <Link href="/profile/orders" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-primary-600 transition-colors mb-6">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Orders
                        </Link>
                        <div className="flex items-center space-x-4">
                            <div className="h-12 w-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600">
                                <Package className="h-6 w-6 stroke-[1.5px]" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-black uppercase tracking-tight text-slate-950 dark:text-white">Order Details</h1>
                                <p className="text-sm text-slate-500 mt-1 flex items-center space-x-2">
                                    <span className="font-mono text-slate-700 dark:text-slate-300">{order._id.substring(0, 10).toUpperCase()}</span>
                                    <span>•</span>
                                    <span>{orderDateFormatted}</span>
                                    <span>{orderTimeFormatted}</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <Button variant="outline" className="h-12 rounded-xl border-slate-200 dark:border-white/10 dark:hover:bg-slate-800">
                            Download Invoice
                        </Button>
                        {(isDelivered || status === 'delivered') && (
                            <Button className="h-12 rounded-xl bg-primary-600 hover:bg-primary-700 text-white shadow-xl shadow-primary-500/20 px-8 font-bold uppercase tracking-widest text-[10px]" onClick={() => alert("Return process started.")}>
                                Return Items
                            </Button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column (Items & Tracking) */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Order Status Timeline */}
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                            <Card className="rounded-[32px] border-none shadow-premium bg-white dark:bg-slate-900 overflow-hidden">
                                <div className="px-8 py-6 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center">
                                    <h2 className="text-lg font-bold uppercase tracking-tight text-slate-950 dark:text-white flex items-center">
                                        <Truck className="mr-3 h-5 w-5 text-primary-600" />
                                        Tracking Delivery
                                    </h2>
                                    <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusBadgeClass(status, isDelivered)}`}>
                                        {getStatusIcon(status, isDelivered)}
                                        {isDelivered ? 'Delivered' : status}
                                    </div>
                                </div>
                                <CardContent className="p-8">
                                    <div className="relative border-l-2 border-slate-100 dark:border-slate-800 ml-3 space-y-8">
                                        {tracking.map((track, idx) => (
                                            <div key={idx} className="relative pl-8">
                                                <div className={`absolute -left-[9px] top-1 h-4 w-4 rounded-full border-4 border-white dark:border-slate-900 ${track.completed ? 'bg-primary-500 dark:bg-primary-400' : 'bg-slate-200 dark:bg-slate-700'
                                                    }`} />
                                                <div className={track.completed ? 'opacity-100' : 'opacity-40'}>
                                                    <p className="text-sm font-bold text-slate-950 dark:text-white">{track.step}</p>
                                                    <p className="text-xs text-slate-500 mt-1">{track.date}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Order Items */}
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                            <Card className="rounded-[32px] border-none shadow-premium bg-white dark:bg-slate-900 overflow-hidden">
                                <div className="px-8 py-6 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/50">
                                    <h2 className="text-lg font-bold uppercase tracking-tight text-slate-950 dark:text-white flex items-center">
                                        <Package className="mr-3 h-5 w-5 text-primary-600" />
                                        Items ordered
                                    </h2>
                                </div>
                                <CardContent className="p-0">
                                    <div className="divide-y divide-slate-100 dark:divide-white/5">
                                        {orderItems.map((item, idx) => (
                                            <div key={idx} className="p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                                                <div className="flex items-center space-x-6 w-full sm:w-auto">
                                                    <div className="h-24 w-24 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200/50 dark:border-white/5">
                                                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-primary-600 mb-1.5">Product</p>
                                                        <p className="text-base font-bold text-slate-950 dark:text-white leading-tight mb-2 max-w-[280px]">{item.name}</p>
                                                        <div className="flex items-center space-x-4 text-xs font-medium text-slate-500">
                                                            <span>Qty: {item.qty}</span>
                                                            <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                                                            <span>₹{item.price.toFixed(2)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col sm:items-end w-full sm:w-auto gap-4">
                                                    <p className="text-lg font-bold text-slate-950 dark:text-white">₹{(item.price * item.qty).toFixed(2)}</p>
                                                    <Button
                                                        variant="outline"
                                                        className="h-9 px-6 rounded-full text-[10px] font-bold uppercase tracking-widest w-full sm:w-auto"
                                                        onClick={() => {
                                                            addItem({
                                                                _id: item.product,
                                                                name: item.name,
                                                                price: item.price,
                                                                image: item.image,
                                                                qty: 1,
                                                                countInStock: 10
                                                            });
                                                            alert(`${item.name} added to cart!`);
                                                        }}
                                                    >
                                                        Buy Again
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>

                    {/* Right Column (Summary & Addresses) */}
                    <div className="space-y-8">
                        {/* Order Summary */}
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                            <Card className="rounded-[32px] border-none shadow-premium bg-white dark:bg-slate-900 overflow-hidden">
                                <div className="px-8 py-6 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/50">
                                    <h2 className="text-lg font-bold uppercase tracking-tight text-slate-950 dark:text-white">Order Summary</h2>
                                </div>
                                <CardContent className="p-8">
                                    <div className="space-y-4 mb-6">
                                        <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                                            <span>Subtotal</span>
                                            <span className="font-semibold text-slate-900 dark:text-white">₹{itemsPrice?.toFixed(2) || (totalPrice - taxPrice - shippingPrice).toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                                            <span>Shipping</span>
                                            <span className="font-semibold text-slate-900 dark:text-white">
                                                {shippingPrice === 0 ? 'Free' : `₹${shippingPrice?.toFixed(2)}`}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                                            <span>Estimated Tax</span>
                                            <span className="font-semibold text-slate-900 dark:text-white">₹{taxPrice?.toFixed(2)}</span>
                                        </div>
                                    </div>
                                    <div className="pt-6 border-t border-slate-100 dark:border-white/5 flex justify-between items-end">
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Paid</p>
                                        </div>
                                        <span className="text-2xl font-black text-primary-600">₹{totalPrice?.toFixed(2)}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Shipping & Payment */}
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                            <Card className="rounded-[32px] border-none shadow-premium bg-white dark:bg-slate-900 overflow-hidden">
                                <CardContent className="p-8 space-y-8">
                                    <div>
                                        <div className="flex items-center mb-4">
                                            <MapPin className="h-4 w-4 text-primary-500 mr-2" />
                                            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-950 dark:text-white">Shipping Address</h3>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5">
                                            <p className="text-sm text-slate-500 leading-relaxed">
                                                {shippingAddress.address}<br />
                                                {shippingAddress.city}, {shippingAddress.postalCode}<br />
                                                {shippingAddress.country}
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center mb-4">
                                            <CreditCard className="h-4 w-4 text-primary-500 mr-2" />
                                            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-950 dark:text-white">Payment Method</h3>
                                        </div>
                                        <div className="flex items-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5">
                                            <div className="h-8 w-12 bg-white rounded flex items-center justify-center p-1 border border-slate-200">
                                                <img src={paymentMethod.toLowerCase().includes('paypal') ? 'https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg' : 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png'} alt="Payment" className="h-full object-contain" />
                                            </div>
                                            <p className="ml-3 text-sm font-medium text-slate-700 dark:text-slate-300 capitalize">{paymentMethod}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
