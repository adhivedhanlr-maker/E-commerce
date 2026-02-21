'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, CreditCard, CheckCircle2, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

const steps = ['Shipping', 'Payment', 'Review'];

export default function CheckoutPage() {
    const [currentStep, setCurrentStep] = useState(0);

    return (
        <div className="bg-white dark:bg-slate-900 py-12 min-h-screen">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
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

                {/* Step Content */}
                <Card className="rounded-3xl border bg-white shadow-sm dark:bg-slate-950 dark:border-slate-800 overflow-hidden">
                    <CardContent className="p-8">
                        <AnimatePresence mode="wait">
                            {currentStep === 0 && (
                                <motion.div
                                    key="step-shipping"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <h2 className="text-xl font-extrabold flex items-center gap-2">
                                        <MapPin className="h-5 w-5 text-primary-600" />
                                        Shipping Address
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Input placeholder="First Name" className="rounded-xl h-12 border-slate-200 bg-slate-50/50 focus-visible:ring-primary-500" />
                                        <Input placeholder="Last Name" className="rounded-xl h-12 border-slate-200 bg-slate-50/50 focus-visible:ring-primary-500" />
                                        <Input placeholder="Address Line 1" className="md:col-span-2 rounded-xl h-12 border-slate-200 bg-slate-50/50 focus-visible:ring-primary-500" />
                                        <Input placeholder="City" className="rounded-xl h-12 border-slate-200 bg-slate-50/50 focus-visible:ring-primary-500" />
                                        <Input placeholder="Postal Code" className="rounded-xl h-12 border-slate-200 bg-slate-50/50 focus-visible:ring-primary-500" />
                                    </div>
                                    <div className="pt-6 border-t flex justify-end">
                                        <Button onClick={() => setCurrentStep(1)} size="lg" className="bg-slate-900 text-white px-10 h-12 rounded-full font-bold flex items-center gap-2 group hover:bg-primary-600 transition-all shadow-lg hover:shadow-primary-500/20">
                                            Next: Payment
                                            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
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
                                    className="space-y-6"
                                >
                                    <h2 className="text-xl font-extrabold flex items-center gap-2">
                                        <CreditCard className="h-5 w-5 text-primary-600" />
                                        Payment Method
                                    </h2>
                                    <div className="space-y-3">
                                        {['Credit / Debit Card', 'UPI / NetBanking', 'Cash on Delivery'].map((method) => (
                                            <label key={method} className="flex items-center justify-between p-4 border rounded-xl cursor-pointer hover:border-primary-500 transition-all dark:border-slate-800">
                                                <div className="flex items-center gap-4">
                                                    <input type="radio" name="payment" className="h-5 w-5 text-primary-600 accent-primary-600" />
                                                    <span className="font-bold text-slate-700 dark:text-slate-300">{method}</span>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                    <div className="pt-6 border-t flex justify-between">
                                        <Button variant="ghost" onClick={() => setCurrentStep(0)} className="text-slate-500 font-bold px-6 h-12">Back</Button>
                                        <Button onClick={() => setCurrentStep(2)} size="lg" className="bg-slate-900 text-white px-10 h-12 rounded-full font-bold flex items-center gap-2 group hover:bg-primary-600 transition-all shadow-lg hover:shadow-primary-500/20">
                                            Next: Review
                                            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
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
                                    className="space-y-6 text-center py-10"
                                >
                                    <div className="flex justify-center mb-6">
                                        <CheckCircle2 className="h-20 w-20 text-green-500" />
                                    </div>
                                    <h2 className="text-2xl font-black text-slate-900 dark:text-white">All set! Ready to place your order?</h2>
                                    <p className="text-slate-500 lowercase">Please review your items and shipping details before final confirmation.</p>
                                    <div className="pt-10 border-t flex flex-col gap-4">
                                        <Button onClick={() => alert('Order Placed!')} size="lg" className="w-full bg-primary-600 text-white h-14 rounded-full font-extrabold text-lg hover:bg-primary-700 hover:shadow-xl hover:shadow-primary-500/30 transition-all">
                                            Place Order
                                        </Button>
                                        <Button variant="ghost" onClick={() => setCurrentStep(1)} className="text-slate-500 font-bold uppercase text-xs tracking-widest h-10">Edit Details</Button>
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
