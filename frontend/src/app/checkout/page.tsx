'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, CreditCard, CheckCircle2, ChevronRight, AlertCircle, RefreshCw, ShoppingCart, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/store/useCart';
import { orderService } from '@/services/orderService';
import Link from 'next/link';

const steps = ['Shipping', 'Payment', 'Review'];

export default function CheckoutPage() {
    const router = useRouter();
    const { cartItems, itemsPrice, shippingPrice, taxPrice, totalPrice, clearCart } = useCart();

    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form State
    const [shippingData, setShippingData] = useState({
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        postalCode: '',
        country: 'India' // Default
    });
    const [paymentMethod, setPaymentMethod] = useState('Credit / Debit Card');

    // Redirect if cart is empty
    useEffect(() => {
        if (cartItems.length === 0 && !loading && currentStep !== 2) {
            // router.push('/cart'); // Keep it on page for now to show state
        }
    }, [cartItems, loading, currentStep]);

    const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setShippingData({ ...shippingData, [e.target.name]: e.target.value });
    };

    const placeOrderHandler = async () => {
        setLoading(true);
        setError(null);
        console.log("Attempting to place order with data:", {
            cartItems,
            shippingData,
            paymentMethod,
            totalPrice
        });

        try {
            // Validate basic data before sending
            if (!cartItems || cartItems.length === 0) throw new Error("Cart is empty");
            if (!shippingData.address || !shippingData.city) throw new Error("Shipping address incomplete");

            const orderData = {
                orderItems: cartItems.map(item => {
                    if (!item._id) console.error("Item missing _id!", item);
                    return {
                        name: item.name,
                        qty: item.qty,
                        image: item.image,
                        price: item.price,
                        product: item._id
                    };
                }),
                shippingAddress: {
                    address: shippingData.address,
                    city: shippingData.city,
                    postalCode: shippingData.postalCode,
                    country: shippingData.country
                },
                paymentMethod: paymentMethod,
                itemsPrice: itemsPrice,
                shippingPrice: shippingPrice,
                taxPrice: taxPrice,
                totalPrice: totalPrice,
            };

            console.log("Final order payload:", orderData);

            const createdOrder = await orderService.createOrder(orderData);
            console.log("Order created successfully:", createdOrder);

            clearCart();
            router.push(`/profile/orders/${createdOrder._id}`);
        } catch (err: any) {
            console.error("CRITICAL Order Placement Error:", err);
            const errMsg = err.response?.data?.message || err.message || 'Unknown error occurred during order placement';
            setError(errMsg);

            // Extreme debug for the user since we can't see their console
            if (process.env.NODE_ENV === 'development') {
                alert(`Placement Failed: ${errMsg}`);
            }
            setLoading(false);
        }
    };

    if (cartItems.length === 0 && currentStep === 0) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
                <div className="h-20 w-20 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center mb-6">
                    <ShoppingCart className="h-10 w-10 text-slate-400" />
                </div>
                <h1 className="text-2xl font-black uppercase tracking-tight text-slate-950 dark:text-white mb-2">Your Cart is Empty</h1>
                <p className="text-slate-500 mb-8">Add items to your cart before proceeding to checkout.</p>
                <Link href="/shop">
                    <Button className="h-12 px-8 rounded-xl font-bold uppercase tracking-widest text-xs bg-primary-600 hover:bg-primary-700 text-white shadow-xl shadow-primary-500/20">
                        Go Shopping
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-slate-900 py-32 min-h-screen">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                <div className="mb-12">
                    <Link href="/cart" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-primary-600 transition-colors mb-6">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Cart
                    </Link>
                    <h1 className="text-4xl font-black uppercase tracking-tighter text-slate-950 dark:text-white">Checkout</h1>
                </div>

                {/* Progress Stepper */}
                <div className="flex items-center justify-between mb-12 relative px-4">
                    {steps.map((step, index) => (
                        <React.Fragment key={step}>
                            <div className="flex flex-col items-center relative z-10 transition-all">
                                <div className={cn(
                                    "h-10 w-10 flex items-center justify-center rounded-full border-2 font-bold transition-all duration-500",
                                    currentStep >= index
                                        ? "bg-primary-600 border-primary-600 text-white shadow-lg shadow-primary-500/30"
                                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400"
                                )}>
                                    {currentStep > index ? <CheckCircle2 className="h-5 w-5" /> : index + 1}
                                </div>
                                <span className={cn(
                                    "text-[10px] font-black mt-3 uppercase tracking-[0.2em] transition-colors duration-500",
                                    currentStep >= index ? "text-primary-600" : "text-slate-400"
                                )}>
                                    {step}
                                </span>
                            </div>

                            {/* Connector Line */}
                            {index < steps.length - 1 && (
                                <div className="flex-1 mx-4 h-0.5 bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                                    <motion.div
                                        initial={{ width: "0%" }}
                                        animate={{ width: currentStep > index ? "100%" : "0%" }}
                                        transition={{ duration: 0.8, ease: "easeInOut" }}
                                        className="absolute inset-0 bg-primary-600"
                                    />
                                </div>
                            )}
                        </React.Fragment>
                    ))}
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-2xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 text-red-600 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                        <AlertCircle className="h-5 w-5" />
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                )}

                {/* Step Content */}
                <Card className="rounded-[32px] border bg-white shadow-premium dark:bg-slate-950 dark:border-slate-800 overflow-hidden">
                    <CardContent className="p-8 md:p-12">
                        <AnimatePresence mode="wait">
                            {currentStep === 0 && (
                                <motion.div
                                    key="step-shipping"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-8"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-2xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-600">
                                            <MapPin className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Shipping Address</h2>
                                            <p className="text-sm text-slate-500">Where should we deliver your order?</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">First Name</label>
                                            <Input name="firstName" value={shippingData.firstName} onChange={handleShippingChange} placeholder="John" className="rounded-xl h-14 border-slate-200 bg-slate-50/50 focus-visible:ring-primary-500" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Last Name</label>
                                            <Input name="lastName" value={shippingData.lastName} onChange={handleShippingChange} placeholder="Doe" className="rounded-xl h-14 border-slate-200 bg-slate-50/50 focus-visible:ring-primary-500" />
                                        </div>
                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Street Address</label>
                                            <Input name="address" value={shippingData.address} onChange={handleShippingChange} placeholder="123 Luxury Avenue" className="rounded-xl h-14 border-slate-200 bg-slate-50/50 focus-visible:ring-primary-500" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">City</label>
                                            <Input name="city" value={shippingData.city} onChange={handleShippingChange} placeholder="New York" className="rounded-xl h-14 border-slate-200 bg-slate-50/50 focus-visible:ring-primary-500" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Postal Code</label>
                                            <Input name="postalCode" value={shippingData.postalCode} onChange={handleShippingChange} placeholder="10001" className="rounded-xl h-14 border-slate-200 bg-slate-50/50 focus-visible:ring-primary-500" />
                                        </div>
                                    </div>

                                    <div className="pt-8 border-t dark:border-slate-800 flex justify-end">
                                        <Button
                                            disabled={!shippingData.firstName || !shippingData.address || !shippingData.city || !shippingData.postalCode}
                                            onClick={() => setCurrentStep(1)}
                                            size="lg"
                                            className="bg-slate-900 dark:bg-white dark:text-slate-900 text-white px-10 h-14 rounded-2xl font-bold flex items-center gap-3 group hover:bg-primary-600 hover:text-white transition-all shadow-xl hover:shadow-primary-500/20"
                                        >
                                            Next: Payment
                                            <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                                        </Button>
                                    </div>
                                </motion.div>
                            )}

                            {currentStep === 1 && (
                                <motion.div
                                    key="step-payment"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-8"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-2xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-600">
                                            <CreditCard className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Payment Method</h2>
                                            <p className="text-sm text-slate-500">Choose how you&apos;d like to pay</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4">
                                        {['Credit / Debit Card', 'UPI / NetBanking', 'Cash on Delivery'].map((method) => (
                                            <label
                                                key={method}
                                                onClick={() => setPaymentMethod(method)}
                                                className={cn(
                                                    "flex items-center justify-between p-6 border-2 rounded-2xl cursor-pointer transition-all",
                                                    paymentMethod === method
                                                        ? "border-primary-500 bg-primary-50/30 dark:bg-primary-900/10"
                                                        : "border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700"
                                                )}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={cn(
                                                        "h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all",
                                                        paymentMethod === method ? "border-primary-500 bg-primary-500" : "border-slate-200"
                                                    )}>
                                                        {paymentMethod === method && <div className="h-2.5 w-2.5 rounded-full bg-white" />}
                                                    </div>
                                                    <span className="font-extrabold text-slate-800 dark:text-slate-200 tracking-tight">{method}</span>
                                                </div>
                                            </label>
                                        ))}
                                    </div>

                                    <div className="pt-8 border-t dark:border-slate-800 flex justify-between">
                                        <Button variant="ghost" onClick={() => setCurrentStep(0)} className="text-slate-500 font-bold px-6 h-14 rounded-2xl">Back</Button>
                                        <Button onClick={() => setCurrentStep(2)} size="lg" className="bg-slate-900 dark:bg-white dark:text-slate-900 text-white px-10 h-14 rounded-2xl font-bold flex items-center gap-3 group hover:bg-primary-600 hover:text-white transition-all shadow-xl hover:shadow-primary-500/20">
                                            Next: Review
                                            <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                                        </Button>
                                    </div>
                                </motion.div>
                            )}

                            {currentStep === 2 && (
                                <motion.div
                                    key="step-review"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-10"
                                >
                                    <div className="text-center">
                                        <div className="flex justify-center mb-6">
                                            <div className="h-20 w-20 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-500">
                                                <CheckCircle2 className="h-10 w-10" />
                                            </div>
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Review Your Order</h2>
                                        <p className="text-slate-500 mt-2">Please double check everything before placing the order.</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-white/5 space-y-4 text-left">
                                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-600">Shipping To</h3>
                                            <p className="font-bold text-slate-900 dark:text-white">{shippingData.firstName} {shippingData.lastName}</p>
                                            <p className="text-sm text-slate-500 leading-relaxed italic">{shippingData.address}, {shippingData.city}, {shippingData.postalCode}, {shippingData.country}</p>
                                        </div>
                                        <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-white/5 space-y-4 text-left">
                                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-600">Payment Via</h3>
                                            <p className="font-bold text-slate-900 dark:text-white">{paymentMethod}</p>
                                            <p className="text-sm text-slate-500 opacity-60 italic">Your order will be processed immediately.</p>
                                        </div>
                                    </div>

                                    <div className="p-8 rounded-3xl bg-slate-950 text-white space-y-4">
                                        <div className="flex justify-between text-sm">
                                            <span className="opacity-60 uppercase tracking-widest font-bold">Subtotal</span>
                                            <span className="font-mono tabular-nums font-bold">₹{itemsPrice.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="opacity-60 uppercase tracking-widest font-bold">Shipping</span>
                                            <span className="font-mono tabular-nums font-bold">₹{shippingPrice.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="opacity-60 uppercase tracking-widest font-bold">Tax</span>
                                            <span className="font-mono tabular-nums font-bold">₹{taxPrice.toFixed(2)}</span>
                                        </div>
                                        <div className="h-px bg-white/10 my-4" />
                                        <div className="flex justify-between text-xl">
                                            <span className="font-black uppercase tracking-tight">Total</span>
                                            <span className="font-mono tabular-nums font-black text-2xl text-primary-400">₹{totalPrice.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <Button
                                            onClick={placeOrderHandler}
                                            disabled={loading}
                                            size="lg"
                                            className="w-full bg-primary-600 text-white h-16 rounded-2xl font-black text-xl hover:bg-primary-700 hover:shadow-2xl hover:shadow-primary-500/40 transition-all flex items-center justify-center gap-3"
                                        >
                                            {loading ? (
                                                <>
                                                    <RefreshCw className="h-6 w-6 animate-spin" />
                                                    Placing Order...
                                                </>
                                            ) : (
                                                'Place Order'
                                            )}
                                        </Button>
                                        <Button variant="ghost" onClick={() => setCurrentStep(1)} className="text-slate-500 font-bold uppercase text-xs tracking-[0.3em] h-12 w-full hover:bg-slate-50 dark:hover:bg-slate-900">Edit Details</Button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

