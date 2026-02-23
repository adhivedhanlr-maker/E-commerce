'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, ArrowRight, Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '@/store/useCart';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function CartPage() {
    const { cartItems, removeItem, updateQty, itemsPrice, shippingPrice, taxPrice, totalPrice } = useCart();

    return (
        <div className="bg-white dark:bg-slate-900 py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-10">Your Shopping Cart</h1>

                {cartItems.length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed rounded-3xl">
                        <div className="flex justify-center mb-8">
                            <div className="relative w-32 h-32 opacity-20 grayscale brightness-50 contrast-125 select-none">
                                <Image
                                    src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=400"
                                    alt="Empty Cart"
                                    fill
                                    className="object-cover rounded-full"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <ShoppingBag className="h-12 w-12 text-slate-900 dark:text-white" />
                                </div>
                            </div>
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Your cart is empty</h2>
                        <p className="text-slate-500 mb-8 lowercase">Looks like you haven&apos;t added anything yet.</p>
                        <Button asChild size="lg" className="rounded-full px-8 h-12 font-bold bg-primary-600 hover:bg-primary-700">
                            <Link href="/shop">
                                <span>Go Shopping</span>
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Cart Items List */}
                        <div className="lg:col-span-2 space-y-6">
                            {cartItems.map((item) => (
                                <Card key={item._id} className="overflow-hidden rounded-2xl border bg-white dark:bg-slate-950 dark:border-slate-800 transition-all hover:shadow-md">
                                    <CardContent className="flex items-center gap-6 p-6">
                                        <div className="h-24 w-24 flex-shrink-0 bg-slate-100 rounded-xl overflow-hidden dark:bg-slate-800 relative">
                                            {item.image ? (
                                                <Image src={item.image} alt={item.name} fill className="object-cover" />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-[10px] font-black uppercase tracking-widest text-slate-300">No Image</div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{item.name}</h3>
                                            <p className="text-primary-600 font-bold mt-1">${item.price}</p>
                                            <div className="mt-4 flex items-center gap-4">
                                                <div className="flex h-10 items-center justify-between rounded-lg border px-2 bg-slate-50 dark:bg-slate-900 dark:border-slate-800 w-32">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-7 w-7 rounded-sm"
                                                        onClick={() => updateQty(item._id, Math.max(1, item.qty - 1))}
                                                    >
                                                        <Minus className="h-3 w-3" />
                                                    </Button>
                                                    <span className="text-sm font-bold w-8 text-center">{item.qty}</span>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-7 w-7 rounded-sm"
                                                        onClick={() => updateQty(item._id, Math.min(item.countInStock || 10, item.qty + 1))}
                                                    >
                                                        <Plus className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-slate-400 hover:text-red-500 transition-colors"
                                                    onClick={() => removeItem(item._id)}
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="text-right hidden sm:block">
                                            <p className="text-lg font-black text-slate-900 dark:text-white">${(item.price * item.qty).toFixed(2)}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Price Breakdown Summary */}
                        <div className="lg:col-span-1">
                            <Card className="sticky top-24 rounded-3xl border bg-slate-50/50 dark:bg-slate-800/20 dark:border-slate-800">
                                <CardContent className="p-8">
                                    <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                                    <div className="space-y-4 text-sm font-medium">
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Subtotal ({cartItems.length} items)</span>
                                            <span className="text-slate-900 dark:text-white">${itemsPrice.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-green-600">
                                            <span className="text-slate-500">Shipping</span>
                                            <span className="font-bold">{shippingPrice === 0 ? 'FREE' : `$${shippingPrice.toFixed(2)}`}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Estimated Tax</span>
                                            <span className="text-slate-900 dark:text-white">${taxPrice.toFixed(2)}</span>
                                        </div>
                                        <div className="h-px bg-slate-200 dark:bg-slate-800 my-4" />
                                        <div className="flex justify-between text-lg font-black">
                                            <span className="text-slate-900 dark:text-white">Total</span>
                                            <span className="text-primary-600">${totalPrice.toFixed(2)}</span>
                                        </div>
                                    </div>
                                    <Button asChild size="lg" className="w-full h-14 rounded-full mt-8 bg-slate-900 hover:bg-primary-600 text-white font-bold transition-all shadow-lg hover:shadow-primary-500/20">
                                        <Link href="/checkout">
                                            Proceed to Checkout
                                        </Link>
                                    </Button>
                                    <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                        <span className="flex h-2 w-2 rounded-full bg-green-500" />
                                        Secure Checkout Guaranteed
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
