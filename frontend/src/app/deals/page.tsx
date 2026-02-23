'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight, Zap, RefreshCw, Star, ShieldCheck, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const deals = [
    {
        id: 1,
        title: "Titan Watch Pro",
        description: "The peak of precision engineering.",
        discount: "25% OFF",
        price: 299.99,
        originalPrice: 399.99,
        image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=800",
        tag: "Bestseller"
    },
    {
        id: 2,
        title: "Aura Pods Elite",
        description: "Sonic clarity like never before.",
        discount: "15% OFF",
        price: 349.00,
        originalPrice: 409.00,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800",
        tag: "Limited Stock"
    },
    {
        id: 3,
        title: "Zenith Keyboard",
        description: "Tactile perfection for creators.",
        discount: "Bundle Deal",
        price: 159.99,
        originalPrice: 199.99,
        image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=800"
    }
];

export default function DealsPage() {
    return (
        <div className="bg-white dark:bg-slate-950 pt-32 pb-24 overflow-hidden">
            <div className="mx-auto max-w-7xl px-6 lg:px-12">
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
                            Exceptional values on our most coveted collections. Available for a limited time only as we make room for what's next.
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
                            <Button className="h-16 px-12 rounded-full bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs uppercase tracking-widest transition-all shadow-xl shadow-primary-900/20">
                                Explore The Archive
                            </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-4">
                                <div className="relative aspect-[4/5] bg-white/5 rounded-3xl border border-white/10 p-6 flex flex-col justify-end group transition-all hover:bg-white/10 cursor-pointer overflow-hidden">
                                    <Image
                                        src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=800"
                                        alt="Audio Archive"
                                        fill
                                        className="object-cover opacity-20 group-hover:opacity-40 transition-opacity duration-500"
                                    />
                                    <div className="relative z-10">
                                        <div className="h-2 w-12 bg-primary-600 rounded-full mb-4 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
                                        <p className="text-white font-bold text-lg mb-1">Audio</p>
                                        <p className="text-slate-500 text-xs uppercase tracking-widest font-black">24 Items</p>
                                    </div>
                                </div>
                                <div className="relative aspect-[4/3] bg-white/5 rounded-3xl border border-white/10 p-6 flex flex-col justify-end group hover:bg-white/10 transition-all cursor-pointer overflow-hidden">
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
                                </div>
                            </div>
                            <div className="space-y-4 pt-12">
                                <div className="relative aspect-[4/3] bg-white/5 rounded-3xl border border-white/10 p-6 flex flex-col justify-end group hover:bg-white/10 transition-all cursor-pointer overflow-hidden">
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
                                </div>
                                <div className="relative aspect-[4/5] bg-white/5 rounded-3xl border border-white/10 p-6 flex flex-col justify-end group hover:bg-white/10 transition-all cursor-pointer overflow-hidden">
                                    <Image
                                        src="https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?auto=format&fit=crop&q=80&w=800"
                                        alt="Tools Archive"
                                        fill
                                        className="object-cover opacity-20 group-hover:opacity-40 transition-opacity duration-500"
                                    />
                                    <div className="relative z-10">
                                        <p className="text-white font-bold text-lg mb-1">Tools</p>
                                        <p className="text-slate-500 text-xs uppercase tracking-widest font-black">15 Items</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Grid of Highlighted Deals */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
                    {deals.map((deal, idx) => (
                        <motion.div
                            key={deal.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: idx * 0.1 }}
                            className="group"
                        >
                            <div className="relative aspect-[4/5] rounded-[32px] overflow-hidden mb-8 bg-slate-100 dark:bg-slate-900 transition-all group-hover:shadow-premium group-hover:-translate-y-2">
                                <Image
                                    src={deal.image}
                                    alt={deal.title}
                                    fill
                                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="absolute top-6 left-6 flex flex-col gap-2">
                                    <span className="bg-primary-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                                        {deal.discount}
                                    </span>
                                    {deal.tag && (
                                        <span className="bg-white/90 dark:bg-black/80 text-slate-950 dark:text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg backdrop-blur-md">
                                            {deal.tag}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-950 dark:text-white mb-2">{deal.title}</h3>
                                <p className="text-slate-500 text-sm mb-4">{deal.description}</p>
                                <div className="flex items-center gap-3">
                                    <span className="text-xl font-black text-primary-600">${deal.price}</span>
                                    <span className="text-sm text-slate-400 line-through font-bold">${deal.originalPrice}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Value Propositions */}
                <div className="border-t border-slate-200 dark:border-white/5 pt-24 grid grid-cols-1 md:grid-cols-4 gap-12">
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
