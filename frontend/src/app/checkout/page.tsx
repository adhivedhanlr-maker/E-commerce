'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, CreditCard, CheckCircle2, ChevronRight, AlertCircle, RefreshCw, ShoppingCart, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/store/useCart';
import { orderService } from '@/services/orderService';
import { paymentService } from '@/services/paymentService';
import Link from 'next/link';

const steps = ['Shipping', 'Review', 'Payment'];

export default function CheckoutPage() {
    // ... items above remain same ...
    const router = useRouter();
    const { cartItems, itemsPrice, shippingPrice, taxPrice, totalPrice, clearCart } = useCart();

    const [currentStep, setCurrentStep] = useState(0);
    // ... states ...
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
    const [cardData, setCardData] = useState({ number: '', expiry: '', cvc: '' });
    const [upiId, setUpiId] = useState('');
    const [upiOption, setUpiOption] = useState<'id' | 'qr'>('id');
    const [isUpiModalOpen, setIsUpiModalOpen] = useState(false);
    const [selectedBank, setSelectedBank] = useState('');
    const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);

    // Redirect if cart is empty
    useEffect(() => {
        if (cartItems.length === 0 && !loading && currentStep !== 2) {
            // router.push('/cart'); // Keep it on page for now to show state
        }
    }, [cartItems, loading, currentStep]);

    const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setShippingData({ ...shippingData, [e.target.name]: e.target.value });
    };

    const isPaymentValid = () => {
        if (paymentMethod === 'Credit / Debit Card') {
            return cardData.number.length === 16 && cardData.expiry.length >= 5 && cardData.cvc.length >= 3;
        }
        if (paymentMethod === 'UPI') {
            return upiOption === 'qr' || (upiId.length > 5 && upiId.includes('@'));
        }
        if (paymentMethod === 'NetBanking') {
            return selectedBank !== '';
        }
        return true; // Cash on Delivery
    };

    const placeOrderHandler = async () => {
        setLoading(true);
        setError(null);
        console.log("[Checkout] Attempting to place order with data:", {
            cartItems: cartItems.length,
            shippingData,
            paymentMethod,
            totalPrice
        });

        try {
            // Validate basic data before sending
            if (!cartItems || cartItems.length === 0) {
                console.error("[Checkout] Cart is empty");
                throw new Error("Your cart is empty. Please add items before checking out.");
            }

            if (!shippingData.firstName || !shippingData.address || !shippingData.city || !shippingData.postalCode) {
                console.error("[Checkout] Incomplete shipping data:", shippingData);
                throw new Error("Please complete all shipping address fields.");
            }

            // 1. Backend-driven payment request for non-COD methods
            if (paymentMethod !== 'Cash on Delivery') {
                console.log(`[Checkout] Initiating ${paymentMethod} payment flow...`);
                setIsPaymentProcessing(true);

                try {
                    // Initiate real backend request
                    const { transactionId } = await paymentService.initiatePayment(paymentMethod, totalPrice);
                    console.log("[Checkout] Payment initiated on backend. Transaction ID:", transactionId);

                    // Polling for confirmation (Simulates original gateway behavior)
                    let paymentFinished = false;
                    let attempts = 0;
                    const maxAttempts = 20; // Increased to 40 seconds max wait

                    while (!paymentFinished && attempts < maxAttempts) {
                        console.log(`[Checkout] Polling payment status (Attempt ${attempts + 1}/${maxAttempts})...`);
                        await new Promise(resolve => setTimeout(resolve, 2000));
                        const check = await paymentService.checkPaymentStatus(transactionId);

                        if (check.status === 'COMPLETED') {
                            paymentFinished = true;
                            console.log("[Checkout] Backend confirmed payment success!");
                        } else if (check.status === 'FAILED') {
                            console.error("[Checkout] Payment failed on device");
                            throw new Error("Payment was declined or failed on your mobile device.");
                        }
                        attempts++;
                    }

                    if (!paymentFinished) {
                        console.error("[Checkout] Payment polling timed out");
                        throw new Error("Payment session timed out. Please check your app or try again.");
                    }
                } catch (paymentErr) {
                    setIsPaymentProcessing(false);
                    throw paymentErr;
                }
            }

            // 2. Prepare order data
            console.log("[Checkout] Preparing order payload...");
            const orderItemsPayload = cartItems
                .filter(item => {
                    const isValid = item._id && /^[0-9a-fA-F]{24}$/.test(item._id);
                    if (!isValid) console.warn("[Checkout] Filtering out invalid item ID:", item._id);
                    return isValid;
                })
                .map(item => ({
                    name: item.name,
                    qty: item.qty,
                    image: item.image,
                    price: item.price,
                    product: item._id
                }));

            if (orderItemsPayload.length === 0) {
                console.error("[Checkout] No valid items left after filtering!");
                throw new Error("There was an issue with the items in your cart. Please try re-adding them.");
            }

            const orderData = {
                orderItems: orderItemsPayload,
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

            console.log("[Checkout] Creating order in database...", orderData);

            // 3. Create the order in the database
            const createdOrder = await orderService.createOrder(orderData);
            console.log("[Checkout] Order created successfully:", createdOrder._id);

            // 4. Mark order as paid in the backend if applicable
            if (paymentMethod !== 'Cash on Delivery') {
                try {
                    console.log("[Checkout] Marking order as PAID...");
                    await orderService.payOrder(createdOrder._id, {
                        id: `PAY-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
                        status: 'COMPLETED',
                        update_time: new Date().toISOString(),
                        email_address: 'customer@nexusstore.com'
                    });
                    console.log("[Checkout] Order status updated to PAID");
                } catch (payError) {
                    console.error("[Checkout] Failed to update payment status (Partial Success):", payError);
                    // We don't throw here as the order was already created
                }
                setIsPaymentProcessing(false);
            }

            console.log("[Checkout] Success! Clearing cart and redirecting...");
            clearCart();
            router.push(`/profile/orders/${createdOrder._id}`);
        } catch (err: unknown) {
            console.error("CRITICAL Order Placement Error:", err);
            const error = err as { response?: { data?: { message?: string } }; message?: string };
            const errMsg = error.response?.data?.message || error.message || 'Unknown error occurred during order placement';
            setError(errMsg);
            setIsPaymentProcessing(false);
            setLoading(false);

            // Extreme debug for developers
            if (process.env.NODE_ENV === 'development') {
                console.error("[DEBUG ONLY] Failure Detail:", errMsg);
            }
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
        <div className="bg-white dark:bg-slate-900 pt-12 md:pt-16 pb-24 min-h-screen">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-12">
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
                                            Next: Review Order
                                            <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                                        </Button>
                                    </div>
                                </motion.div>
                            )}

                            {currentStep === 1 && (
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
                                        <p className="text-slate-500 mt-2">Please double check everything before proceeding to payment.</p>
                                    </div>

                                    <div className="grid grid-cols-1 gap-8">
                                        <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-white/5 space-y-4 text-left">
                                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-600">Shipping To</h3>
                                            <p className="font-bold text-slate-900 dark:text-white">{shippingData.firstName} {shippingData.lastName}</p>
                                            <p className="text-sm text-slate-500 leading-relaxed italic">{shippingData.address}, {shippingData.city}, {shippingData.postalCode}, {shippingData.country}</p>
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

                                    <div className="pt-8 border-t dark:border-slate-800 flex justify-between gap-4">
                                        <Button variant="ghost" onClick={() => setCurrentStep(0)} className="text-slate-500 font-bold px-6 h-14 rounded-2xl">Back</Button>
                                        <Button
                                            onClick={() => setCurrentStep(2)}
                                            size="lg"
                                            className="flex-1 bg-slate-900 dark:bg-white dark:text-slate-900 text-white h-14 rounded-2xl font-bold flex items-center justify-center gap-3 group hover:bg-primary-600 hover:text-white transition-all shadow-xl hover:shadow-primary-500/20"
                                        >
                                            Next: Payment Method
                                            <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                                        </Button>
                                    </div>
                                </motion.div>
                            )}

                            {currentStep === 2 && (
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
                                            <p className="text-sm text-slate-500">Select your preferred method to complete payment.</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4">
                                        {['Credit / Debit Card', 'UPI', 'NetBanking', 'Cash on Delivery'].map((method) => (
                                            <div key={method} className="space-y-4">
                                                <div
                                                    onClick={() => {
                                                        setPaymentMethod(method);
                                                        if (method === 'UPI') setIsUpiModalOpen(true);
                                                    }}
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
                                                </div>

                                                {/* Inline Detail Forms for non-modal methods */}
                                                <AnimatePresence>
                                                    {paymentMethod === method && method === 'Credit / Debit Card' && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            className="overflow-hidden px-2 pb-4 space-y-4"
                                                        >
                                                            <div className="space-y-1.5">
                                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Card Number</label>
                                                                <Input
                                                                    placeholder="0000 0000 0000 0000"
                                                                    value={cardData.number}
                                                                    onChange={(e) => setCardData({ ...cardData, number: e.target.value.replace(/\D/g, '').slice(0, 16) })}
                                                                    className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 font-mono tracking-widest h-14 rounded-2xl focus:ring-primary-500/20"
                                                                />
                                                            </div>
                                                            <div className="flex gap-4">
                                                                <div className="flex-1 space-y-1.5">
                                                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Expiry</label>
                                                                    <Input
                                                                        placeholder="MM/YY"
                                                                        value={cardData.expiry}
                                                                        onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                                                                        className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 font-mono tracking-widest h-14 rounded-2xl focus:ring-primary-500/20"
                                                                    />
                                                                </div>
                                                                <div className="flex-1 space-y-1.5">
                                                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">CVC</label>
                                                                    <Input
                                                                        placeholder="123"
                                                                        type="password"
                                                                        value={cardData.cvc}
                                                                        onChange={(e) => setCardData({ ...cardData, cvc: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                                                                        className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 font-mono tracking-widest h-14 rounded-2xl focus:ring-primary-500/20"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    )}

                                                    {paymentMethod === method && method === 'NetBanking' && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            className="overflow-hidden px-2 pb-4"
                                                        >
                                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                                {['HDFC Bank', 'SBI', 'ICICI Bank', 'Axis Bank', 'Kotak', 'Others'].map((bank) => (
                                                                    <Button
                                                                        key={bank}
                                                                        variant={selectedBank === bank ? 'default' : 'outline'}
                                                                        onClick={() => setSelectedBank(bank)}
                                                                        className={cn(
                                                                            "h-16 rounded-2xl font-bold transition-all",
                                                                            selectedBank === bank ? "border-primary-500 bg-primary-500" : "border-slate-100"
                                                                        )}
                                                                    >
                                                                        {bank}
                                                                    </Button>
                                                                ))}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="pt-8 border-t dark:border-slate-800 flex justify-between gap-4">
                                        <Button
                                            variant="ghost"
                                            onClick={() => setCurrentStep(1)}
                                            className="text-slate-500 font-bold px-6 h-14 rounded-2xl"
                                        >
                                            Back
                                        </Button>

                                        <Button
                                            onClick={placeOrderHandler}
                                            disabled={loading || !isPaymentValid()}
                                            size="lg"
                                            className="flex-1 bg-primary-600 text-white h-14 rounded-2xl font-black text-lg hover:bg-primary-700 hover:shadow-2xl hover:shadow-primary-500/40 transition-all flex items-center justify-center gap-3"
                                        >
                                            {loading ? (
                                                <>
                                                    <RefreshCw className="h-6 w-6 animate-spin" />
                                                    Placing Order...
                                                </>
                                            ) : (
                                                'Pay & Place Order'
                                            )}
                                        </Button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </CardContent>
                </Card>
            </div>

            {/* Payment Processing Overlay */}
            <AnimatePresence>
                {isPaymentProcessing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-xl p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white dark:bg-slate-900 rounded-[40px] p-10 max-w-md w-full shadow-2xl border border-white/20 dark:border-slate-800 text-center space-y-8"
                        >
                            <div className="relative mx-auto w-24 h-24">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 rounded-full border-4 border-t-primary-500 border-r-transparent border-b-primary-500/20 border-l-transparent"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="h-16 w-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-primary-600">
                                        <RefreshCw className="h-8 w-8 animate-spin-slow" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h2 className="text-2xl font-black uppercase tracking-tight text-slate-950 dark:text-white">
                                    Payment Pending
                                </h2>
                                <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                                    A request for <span className="text-primary-600 font-bold">₹{totalPrice.toLocaleString()}</span> has been sent to your mobile device.
                                </p>
                            </div>

                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-6 border border-slate-100 dark:border-slate-800">
                                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Instructions</p>
                                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                    Open your UPI or Bank app and authorize the transaction to complete your order.
                                </p>
                            </div>

                            <p className="text-[10px] font-black uppercase tracking-widest text-primary-600/60 animate-pulse">
                                Waiting for confirmation...
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* UPI Modal Pop-up */}
            <AnimatePresence>
                {isUpiModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 40 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 40 }}
                            className="bg-white dark:bg-slate-950 rounded-[40px] p-8 md:p-12 max-w-lg w-full shadow-[0_32px_80px_-16px_rgba(0,0,0,0.3)] border border-slate-200 dark:border-slate-800 relative"
                        >
                            <button
                                onClick={() => setIsUpiModalOpen(false)}
                                className="absolute top-8 right-8 h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-500 hover:text-red-500 transition-colors"
                            >
                                <AlertCircle className="rotate-45 h-5 w-5" />
                            </button>

                            <div className="space-y-8">
                                <div className="text-center">
                                    <div className="h-20 w-20 rounded-3xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 mx-auto mb-6">
                                        <CreditCard className="h-10 w-10" />
                                    </div>
                                    <h2 className="text-3xl font-black uppercase tracking-tight text-slate-950 dark:text-white">UPI Details</h2>
                                    <p className="text-slate-500 mt-2">Choose how you want to pay</p>
                                </div>

                                <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl">
                                    <button
                                        onClick={() => setUpiOption('id')}
                                        className={cn(
                                            "flex-1 h-12 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                                            upiOption === 'id' ? "bg-white dark:bg-slate-800 shadow-sm text-primary-600" : "text-slate-500"
                                        )}
                                    >
                                        UPI ID
                                    </button>
                                    <button
                                        onClick={() => setUpiOption('qr')}
                                        className={cn(
                                            "flex-1 h-12 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                                            upiOption === 'qr' ? "bg-white dark:bg-slate-800 shadow-sm text-primary-600" : "text-slate-500"
                                        )}
                                    >
                                        QR Scanner
                                    </button>
                                </div>

                                {upiOption === 'id' ? (
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Enter UPI ID</label>
                                        <Input
                                            placeholder="username@bank"
                                            value={upiId}
                                            onChange={(e) => setUpiId(e.target.value)}
                                            className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 h-16 rounded-2xl font-mono text-center text-lg focus:ring-primary-500"
                                        />
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-900/50 rounded-[32px] border border-dashed border-slate-200 dark:border-slate-800">
                                        <div className="relative w-48 h-48 bg-white p-4 rounded-3xl shadow-2xl mb-6 flex items-center justify-center">
                                            <Image
                                                src="/images/upi-qr.png"
                                                alt="UPI QR Code"
                                                width={180}
                                                height={180}
                                                className="object-contain"
                                            />
                                        </div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-600 animate-pulse">Ready for scanning</p>
                                    </div>
                                )}

                                <Button
                                    disabled={!isPaymentValid()}
                                    onClick={() => setIsUpiModalOpen(false)}
                                    className="w-full h-16 rounded-2xl bg-slate-950 dark:bg-white dark:text-slate-950 text-white font-black text-lg shadow-xl hover:bg-primary-600 hover:text-white transition-all"
                                >
                                    Confirm Details
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

