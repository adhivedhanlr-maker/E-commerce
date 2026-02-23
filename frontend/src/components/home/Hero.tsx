'use client';

import React from 'react';
import { motion, cubicBezier } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const Hero = () => {
    return (
        <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-background pt-20">
            {/* Artistic Background Elements */}
            <div className="absolute top-0 right-0 w-2/3 h-full bg-secondary-100/50 -skew-x-12 translate-x-1/4 dark:bg-white/5" />
            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, 0],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] rounded-full bg-primary-600/5 blur-[120px]"
            />

            <div className="container mx-auto px-6 lg:px-12 relative z-10">
                <div className="max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, ease: cubicBezier(0.16, 1, 0.3, 1) }}
                    >
                        <div className="flex items-center space-x-3 mb-8">
                            <div className="h-[1px] w-12 bg-primary-600" />
                            <span className="text-[12px] font-black uppercase tracking-[0.3em] text-primary-600">
                                Curated Excellence 2026
                            </span>
                        </div>

                        <h1 className="font-accent text-6xl md:text-8xl lg:text-9xl font-bold tracking-[-0.04em] leading-[0.9] text-slate-950 dark:text-white mb-8">
                            Refined <br />
                            <span className="text-secondary-400 dark:text-secondary-600">Everyday</span> <br />
                            Essentials
                        </h1>

                        <p className="max-w-lg text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-12 leading-relaxed">
                            Discover a handpicked collection of premium goods designed for the modern connoisseur.
                            Where artisanal craftsmanship meets contemporary innovation.
                        </p>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-6 sm:space-y-0 sm:space-x-8">
                            <Button asChild size="lg" className="group rounded-full bg-primary-600 px-10 h-16 text-md font-bold hover:bg-primary-700 transition-all shadow-premium hover:shadow-premium-hover">
                                <Link href="/shop" className="flex items-center space-x-3">
                                    <span>Explore Collection</span>
                                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </Button>

                            <div className="flex flex-col space-y-1">
                                <div className="flex items-center space-x-1">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <Star key={i} className="h-3 w-3 fill-primary-600 text-primary-600" />
                                    ))}
                                </div>
                                <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
                                    Trusted by 50k+ Customers
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Layered Product Detail Visuals (Abstract) */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1.5, ease: cubicBezier(0.16, 1, 0.3, 1), delay: 0.2 }}
                className="absolute right-[-10%] bottom-[10%] hidden lg:block w-1/2"
            >
                <div className="relative">
                    {/* Main "Object" Frame */}
                    <div className="aspect-[4/5] bg-secondary-200/30 rounded-3xl backdrop-blur-sm border border-white/20 dark:bg-white/5 overflow-hidden shadow-premium relative">
                        <Image
                            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200"
                            alt="Premium Texture"
                            fill
                            className="object-cover mix-blend-overlay opacity-50 dark:opacity-30"
                        />
                    </div>

                    {/* Floating Detail Card */}
                    <motion.div
                        animate={{ y: [0, -15, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute bottom-1/4 -left-12 bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-premium border border-secondary-200/50 dark:bg-black/90 dark:border-white/10 z-20"
                    >
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary-600 mb-2">Material focus</p>
                        <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-1 leading-none">Aerospace Grade</h4>
                        <p className="text-xs text-slate-500">Precision machined aluminum alloy.</p>
                    </motion.div>

                    {/* Smaller Floating Indicator */}
                    <motion.div
                        animate={{ y: [0, 15, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                        className="absolute top-1/4 right-10 bg-primary-600 p-4 rounded-full shadow-premium"
                    >
                        <div className="bg-white/20 h-8 w-8 rounded-full flex items-center justify-center">
                            <ArrowRight className="text-white h-4 w-4" />
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-2 opacity-50"
            >
                <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-slate-400 to-transparent" />
                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-950 dark:text-white">Scroll</span>
            </motion.div>
        </section>
    );
};

export default Hero;
