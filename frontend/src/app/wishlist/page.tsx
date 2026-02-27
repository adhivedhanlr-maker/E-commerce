'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, cubicBezier } from 'framer-motion';
import { Heart, Trash2, ShoppingCart, ArrowRight, Sparkles } from 'lucide-react';
import { useWishlist } from '@/store/useWishlist';
import { useCart } from '@/store/useCart';
import { Button } from '@/components/ui/button';

export default function WishlistPage() {
    const { wishlistItems, removeItem } = useWishlist();
    const { addItem: addToCart } = useCart();

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemAnim = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: cubicBezier(0.16, 1, 0.3, 1) } }
    };

    return (
        <div className="bg-background min-h-screen pt-24 pb-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-12">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-16"
                >
                    <div className="flex items-center space-x-2 text-primary-600 mb-4">
                        <Sparkles className="h-4 w-4" />
                        <span className="text-[11px] font-black uppercase tracking-[0.3em]">Curation</span>
                    </div>
                    <h1 className="font-accent text-5xl md:text-6xl font-bold text-slate-950 dark:text-white mb-4">
                        Your <span className="italic font-light text-secondary-400">Atmosphere</span>
                    </h1>
                    <p className="text-slate-500 text-lg max-w-md">
                        A sanctuary for the pieces you&apos;ve chosen to define your space and lifestyle.
                    </p>
                </motion.div>

                {wishlistItems.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-40 bg-secondary-100 rounded-[40px] dark:bg-white/5 border border-dashed border-secondary-300 dark:border-white/10"
                    >
                        <div className="flex justify-center mb-8">
                            <div className="relative w-48 h-48">
                                <motion.div
                                    animate={{
                                        rotate: [0, 360],
                                        scale: [1, 1.05, 1]
                                    }}
                                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 border-2 border-dashed border-primary-600/30 rounded-full"
                                />
                                <div className="absolute inset-4 rounded-full overflow-hidden bg-white/10 backdrop-blur-sm grayscale opacity-30 select-none">
                                    <Image
                                        src="https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=400"
                                        alt="Empty Wishlist"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Heart className="h-12 w-12 text-primary-600" />
                                </div>
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-950 dark:text-white mb-4">The curation is empty</h2>
                        <p className="text-slate-500 mb-10 max-w-xs mx-auto">Discover pieces that resonate with your vision and save them here.</p>
                        <Button asChild size="lg" className="rounded-full px-12 h-16 font-bold bg-primary-600 hover:bg-primary-700 shadow-premium transition-all hover:shadow-premium-hover">
                            <Link href="/shop" className="flex items-center space-x-3">
                                <span>Explore Gallery</span>
                                <ArrowRight className="h-5 w-5" />
                            </Link>
                        </Button>
                    </motion.div>
                ) : (
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16"
                    >
                        {wishlistItems.map((product: { _id: string; name: string; price: number; image?: string }) => (
                            <motion.div key={product._id} variants={itemAnim} className="group relative">
                                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-secondary-100 dark:bg-white/5">
                                    {/* Action Reveal */}
                                    <div className="absolute top-4 right-4 z-20 opacity-0 translate-x-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0">
                                        <Button
                                            variant="secondary"
                                            size="icon"
                                            onClick={() => removeItem(product._id)}
                                            className="h-10 w-10 rounded-full bg-white/90 backdrop-blur-md text-slate-400 hover:text-red-500 dark:bg-black/80 shadow-premium"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    {/* Image with zoom */}
                                    <div className="h-full w-full transition-transform duration-1000 group-hover:scale-105 flex items-center justify-center">
                                        {product.image ? (
                                            <Image
                                                src={product.image}
                                                alt={product.name}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            />
                                        ) : (
                                            <div className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 dark:text-white/10">No Image</div>
                                        )}
                                    </div>

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                </div>

                                <div className="mt-6 space-y-3 px-1">
                                    <h3 className="text-lg font-bold tracking-tight text-slate-950 dark:text-white">{product.name}</h3>
                                    <p className="text-xl font-black text-primary-600">₹{product.price}</p>

                                    <div className="pt-2">
                                        <Button
                                            onClick={() => {
                                                addToCart({ ...product, qty: 1, countInStock: 10, image: product.image || '' });
                                                removeItem(product._id);
                                            }}
                                            className="w-full bg-slate-950 text-white dark:bg-white dark:text-black h-14 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-primary-600 dark:hover:bg-primary-600 dark:hover:text-white transition-all shadow-premium hover:shadow-premium-hover flex items-center justify-center space-x-3"
                                        >
                                            <ShoppingCart className="h-4 w-4" />
                                            <span>Reserve Item</span>
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
}
