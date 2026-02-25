'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, cubicBezier } from 'framer-motion';
import { Heart, Star, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/store/useCart';
import { useWishlist } from '@/store/useWishlist';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
    product: {
        _id: string;
        name: string;
        price: number;
        originalPrice: number;
        discountPercentage: number;
        rating: number;
        images: string[];
        brand: string;
    };
    aspectRatio?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, aspectRatio = "aspect-[3.6/4]" }) => {
    const { addItem: addToCart } = useCart();
    const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist();

    const isWishlisted = isInWishlist(product._id);

    const toggleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isWishlisted) {
            removeFromWishlist(product._id);
        } else {
            addToWishlist({
                _id: product._id,
                name: product.name,
                price: product.price,
                image: product.images[0] || '',
            });
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: cubicBezier(0.16, 1, 0.3, 1) }}
            className="group relative h-full"
        >
            <Link href={`/product/${product._id}`} className="flex flex-col h-full">
                {/* Image Container */}
                <div className={cn("relative overflow-hidden rounded-2xl bg-secondary-100 dark:bg-white/5 shadow-sm transition-all duration-700 ease-in-out group-hover:shadow-premium", aspectRatio)}>
                    {/* Actions - Redesigned for persistent but subtle presence */}
                    <div className="absolute top-4 right-4 z-20 flex flex-col space-y-2 translate-x-1 opacity-60 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                        <Button
                            size="icon"
                            variant="secondary"
                            onClick={toggleWishlist}
                            className={cn(
                                "h-11 w-11 rounded-full shadow-premium backdrop-blur-md transition-all hover:scale-110",
                                isWishlisted ? "bg-primary-600 text-white hover:bg-primary-700" : "bg-white/90 text-slate-900 hover:bg-white dark:bg-black/80 dark:text-white"
                            )}
                        >
                            <Heart className={cn("h-4 w-4 stroke-[2px]", isWishlisted && "fill-current")} />
                        </Button>
                    </div>

                    {/* Quick Add - Reveal on Hover */}
                    <div className="absolute inset-x-0 bottom-0 z-20 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                        <Button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                addToCart({ ...product, qty: 1, countInStock: 10, image: product.images[0] || '' });
                            }}
                            className="w-full bg-slate-950/90 backdrop-blur-md text-white h-12 rounded-xl shadow-premium hover:bg-primary-600 transition-all active:scale-95 flex items-center justify-center space-x-2 font-bold text-xs uppercase tracking-widest"
                        >
                            <Plus className="h-4 w-4" />
                            <span>Add to Bag</span>
                        </Button>
                    </div>

                    {/* Badge */}
                    {product.discountPercentage > 0 && (
                        <div className="absolute top-6 left-6 z-20">
                            <span className="bg-primary-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-premium">
                                {product.discountPercentage}% OFF
                            </span>
                        </div>
                    )}

                    {/* Image with zoom */}
                    <div className="h-full w-full bg-gradient-to-br from-secondary-100 to-secondary-200 transition-transform duration-1000 group-hover:scale-105 dark:from-white/5 dark:to-white/10 flex items-center justify-center relative">
                        {product.images[0] ? (
                            <Image
                                src={product.images[0]}
                                alt={product.name}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        ) : (
                            <div className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 dark:text-white/10">No Image</div>
                        )}
                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                </div>

                {/* Info Section */}
                <div className="mt-3 flex flex-col flex-1 space-y-1 px-2 pb-3">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-600">
                            {product.brand}
                        </span>
                        <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                            <span className="text-[11px] font-bold text-slate-500">{product.rating}</span>
                        </div>
                    </div>

                    <h3 className="text-sm font-bold tracking-tight text-slate-950 transition-colors group-hover:text-primary-600 dark:text-white line-clamp-2">
                        {product.name}
                    </h3>

                    <div className="flex flex-col mt-auto pt-1">
                        <p className="text-base font-black text-slate-950 dark:text-white">${product.price.toFixed(2)}</p>
                        {product.originalPrice > product.price && (
                            <p className="text-[11px] text-slate-400 line-through font-medium leading-none">${product.originalPrice.toFixed(2)}</p>
                        )}
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default ProductCard;
