'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Zap, RefreshCw, Star, ShieldCheck, ShoppingBag, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { getProducts } from '@/services/productService';
import ProductCard from '@/components/product/ProductCard';

export default function DealsPage() {
    const [deals, setDeals] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDeals = async () => {
            setIsLoading(true);
            try {
                // Fetch products and filter for those with significant discounts
                const response = await getProducts({ pageSize: 50 });
                const allProducts = response?.data?.products || response?.products || [];
                
                // Get products with discount > 0, sorted by discount percentage
                const discounted = allProducts
                    .filter((p: any) => p.discountPercentage > 0)
                    .sort((a: any, b: any) => b.discountPercentage - a.discountPercentage);
                
                setDeals(discounted.slice(0, 12));
            } catch (error) {
                console.error('Error fetching deals:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDeals();
    }, []);

    return (
        <div className="bg-white dark:bg-slate-950 pt-12 md:pt-16 pb-24 overflow-hidden">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
                {/* Hero Header */}
                <div className="relative mb-24">
                    <motion.div
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.5 }}
                        className="absolute -top-32 -left-32 w-96 h-96 bg-primary-600/5 blur-[120px] rounded-full"
                    />

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center max-w-3xl mx-auto"
                    >
                        <div className="inline-flex items-center space-x-2 text-primary-600 mb-6 bg-primary-50 dark:bg-primary-900/20 px-4 py-2 rounded-full border border-primary-100 dark:border-primary-800">
                            <Zap className="h-4 w-4 fill-current" />
                            <span className="text-[11px] font-black uppercase tracking-[0.3em]">The Equinox Flash Event</span>
                        </div>
                        <h1 className="font-accent text-6xl md:text-8xl font-bold tracking-tight text-slate-950 dark:text-white leading-none">
                            Featured <span className="italic font-light text-secondary-400">Opportunity</span>
                        </h1>
                        <p className="mt-8 text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-light">
                            Exceptional values on our most coveted collections. Available for a limited time only as we make room for what&apos;s next.
                        </p>
                    </motion.div>
                </div>

                {/* Big Promotional Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="relative rounded-[40px] bg-slate-950 p-12 lg:p-20 overflow-hidden mb-32 border border-white/5 shadow-2xl"
                >
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-primary-600/20 blur-[150px] pointer-events-none" />

                    <div className="relative z-10 lg:flex items-center justify-between">
                        <div className="max-w-xl mb-12 lg:mb-0">
                            <span className="text-primary-600 text-[11px] font-black uppercase tracking-[0.4em] mb-4 block">Limited Time</span>
                            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">Nexus Archival <br /><span className="italic text-slate-400 font-light text-3xl">Up to 40% Off</span></h2>
                            <p className="text-slate-400 mb-10 text-lg leading-relaxed">
                                Curated selections from previous seasons, handpicked for their timeless design and enduring utility.
                            </p>
                            <Button asChild className="h-16 px-12 rounded-full bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs uppercase tracking-widest transition-all shadow-xl shadow-primary-900/20">
                                <Link href="/shop?cat=studio">Explore The Archive</Link>
                            </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-4">
                                <Link href="/shop?cat=studio" className="relative aspect-[4/5] bg-white/5 rounded-3xl border border-white/10 p-6 flex flex-col justify-end group transition-all hover:bg-white/10 cursor-pointer overflow-hidden block">
                                    <Image
                                        src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=800"
                                        alt="Audio Archive"
                                        fill
                                        className="object-cover opacity-20 group-hover:opacity-40 transition-opacity duration-500"
                                    />
                                    <div className="relative z-10">
                                        <div className="h-2 w-12 bg-primary-600 rounded-full mb-4 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
                                        <p className="text-white font-bold text-lg mb-1">Studio</p>
                                        <p className="text-slate-500 text-xs uppercase tracking-widest font-black">24 Items</p>
                                    </div>
                                </Link>
                                <Link href="/shop?cat=optics" className="relative aspect-[4/3] bg-white/5 rounded-3xl border border-white/10 p-6 flex flex-col justify-end group hover:bg-white/10 transition-all cursor-pointer overflow-hidden block">
                                    <Image
                                        src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800"
                                        alt="Optics Archive"
                                        fill
                                        className="object-cover opacity-20 group-hover:opacity-40 transition-opacity duration-500"
                                    />
                                    <div className="relative z-10">
                                        <p className="text-white font-bold text-lg mb-1">Optics</p>
                                        <p className="text-slate-500 text-xs uppercase tracking-widest font-black">12 Items</p>
                                    </div>
                                </Link>
                            </div>
                            <div className="space-y-4 pt-12">
                                <Link href="/shop?cat=wear" className="relative aspect-[4/3] bg-white/5 rounded-3xl border border-white/10 p-6 flex flex-col justify-end group hover:bg-white/10 transition-all cursor-pointer overflow-hidden block">
                                    <Image
                                        src="https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800"
                                        alt="Wear Archive"
                                        fill
                                        className="object-cover opacity-20 group-hover:opacity-40 transition-opacity duration-500"
                                    />
                                    <div className="relative z-10">
                                        <p className="text-white font-bold text-lg mb-1">Wear</p>
                                        <p className="text-slate-500 text-xs uppercase tracking-widest font-black">08 Items</p>
                                    </div>
                                </Link>
                                <Link href="/shop?cat=lifestyle" className="relative aspect-[4/5] bg-white/5 rounded-3xl border border-white/10 p-6 flex flex-col justify-end group hover:bg-white/10 transition-all cursor-pointer overflow-hidden block">
                                    <Image
                                        src="https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?auto=format&fit=crop&q=80&w=800"
                                        alt="Lifestyle Archive"
                                        fill
                                        className="object-cover opacity-20 group-hover:opacity-40 transition-opacity duration-500"
                                    />
                                    <div className="relative z-10">
                                        <p className="text-white font-bold text-lg mb-1">Lifestyle</p>
                                        <p className="text-slate-500 text-xs uppercase tracking-widest font-black">15 Items</p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Grid of Highlighted Deals */}
                {isLoading ? (
                    <div className="py-20 flex flex-col items-center justify-center space-y-4">
                        <Loader2 className="h-12 w-12 animate-spin text-primary-600" />
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Loading Latest Values</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-32">
                        {deals.map((deal, idx) => (
                            <ProductCard key={deal._id} product={deal} />
                        ))}
                    </div>
                )}

                {/* Value Propositions */}
                <div className="border-t border-slate-200 dark:border-white/5 pt-16 grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                    {[
                        { icon: Star, title: "Curated Only", desc: "Every deal is manually approved for quality." },
                        { icon: RefreshCw, title: "Final Sale", desc: "Limited quantities, no restocks planned." },
                        { icon: ShieldCheck, title: "Warranty", desc: "Full protection even on seasonal pieces." },
                        { icon: ShoppingBag, title: "Express Ship", desc: "Complimentary 2-day priority delivery." }
                    ].map((item, idx) => (
                        <div key={idx} className="flex flex-col items-center text-center">
                            <div className="h-12 w-12 rounded-2xl bg-secondary-100 dark:bg-white/5 flex items-center justify-center mb-6 text-primary-600">
                                <item.icon className="h-6 w-6 stroke-[1.5px]" />
                            </div>
                            <h4 className="font-bold text-slate-950 dark:text-white mb-2">{item.title}</h4>
                            <p className="text-xs text-slate-500 leading-relaxed max-w-[200px]">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
