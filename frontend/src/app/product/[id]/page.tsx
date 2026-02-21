'use client';

import React, { useState } from 'react';
import { Star, ShoppingCart, Heart, MapPin, Truck, ShieldCheck, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/store/useCart';
import { useWishlist } from '@/store/useWishlist';
import ImageGallery from '@/components/product/ImageGallery';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const product = {
    _id: '1',
    name: 'Aura Pods Elite',
    price: 349.00,
    originalPrice: 429.00,
    discountPercentage: 20,
    rating: 4.8,
    numReviews: 128,
    brand: 'Nexus Audio',
    description: 'Experience pure sound with the all-new Aura Pods Elite. Featuring active noise cancellation, 40-hour battery life, and cinematic audio quality with our bespoke titanium drivers.',
    images: [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?auto=format&fit=crop&q=80&w=800"
    ],
    countInStock: 25,
    specifications: {
        'Battery Life': '40 Hours',
        'Connectivity': 'Bluetooth 5.3, USB-C',
        'Noise Cancellation': 'Active (ANC)',
        'Weight': '250g',
    }
};

export default function ProductPage() {
    const [qty, setQty] = useState(1);
    const [pincode, setPincode] = useState('');
    const [isCheckSuccess, setIsCheckSuccess] = useState<boolean | null>(null);

    const { addItem: addToCart } = useCart();
    const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist();

    const isWishlisted = isInWishlist(product._id);

    const toggleWishlist = () => {
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

    const checkDelivery = () => {
        if (pincode.length === 6) {
            setIsCheckSuccess(true);
        } else {
            setIsCheckSuccess(false);
        }
    };

    return (
        <div className="bg-white dark:bg-slate-900 pb-20 pt-8">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                    {/* Left: Image Gallery */}
                    <ImageGallery images={product.images} />

                    {/* Right: Product Details */}
                    <div className="space-y-8">
                        <div>
                            <nav className="flex text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                                <span className="hover:text-primary-600 cursor-pointer">Electronics</span>
                                <span className="mx-2">/</span>
                                <span className="hover:text-primary-600 cursor-pointer">Audio</span>
                            </nav>
                            <h1 className="text-3xl font-extrabold text-slate-900 lg:text-4xl dark:text-white">
                                {product.name}
                            </h1>
                            <div className="mt-4 flex items-center gap-4">
                                <div className="flex items-center text-amber-500">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={cn("h-4 w-4 fill-current", i >= 4 && "fill-none")} />
                                    ))}
                                    <span className="ml-2 text-sm font-bold text-slate-600 dark:text-slate-400">
                                        {product.rating} ({product.numReviews} Reviews)
                                    </span>
                                </div>
                                <span className="h-4 w-px bg-slate-200" />
                                <Badge variant="outline" className="text-green-600 border-green-600 bg-green-50/50">In Stock</Badge>
                            </div>
                        </div>

                        <div className="flex items-baseline gap-4 border-y py-6">
                            <span className="text-4xl font-black text-primary-600">${product.price}</span>
                            <span className="text-xl text-slate-400 line-through">${product.originalPrice}</span>
                            <Badge className="bg-red-500 hover:bg-red-500 text-white font-bold h-6 border-none px-2 rounded-full">
                                {product.discountPercentage}% OFF
                            </Badge>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white leading-none">Quantity</h3>
                            <div className="flex h-12 w-32 items-center justify-between rounded-xl border border-slate-200 px-2 dark:border-slate-800 bg-slate-50/50">
                                <Button variant="ghost" size="icon" onClick={() => setQty(Math.max(1, qty - 1))} className="h-8 w-8 font-bold">-</Button>
                                <span className="font-bold">{qty}</span>
                                <Button variant="ghost" size="icon" onClick={() => setQty(qty + 1)} className="h-8 w-8 font-bold">+</Button>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <Button
                                size="lg"
                                onClick={() => addToCart({ ...product, qty, image: product.images[0] || '' })}
                                className="flex-1 rounded-full bg-primary-600 h-14 text-sm font-bold text-white transition-all hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-500/30"
                            >
                                <ShoppingCart className="mr-2 h-5 w-5" />
                                Add to Cart
                            </Button>
                            <Button
                                size="icon"
                                variant="outline"
                                onClick={toggleWishlist}
                                className={cn(
                                    "rounded-full border-slate-200 h-14 w-14 transition-all hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800",
                                    isWishlisted ? "text-red-500" : "text-slate-900"
                                )}
                            >
                                <Heart className={cn("h-6 w-6", isWishlisted && "fill-current")} />
                            </Button>
                        </div>

                        {/* Pincode Checker */}
                        <Card className="rounded-2xl border bg-slate-50/50 dark:bg-slate-800/20 dark:border-slate-800">
                            <CardContent className="p-6">
                                <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-primary-600" />
                                    Check Delivery Availability
                                </h3>
                                <div className="flex gap-2">
                                    <Input
                                        type="text"
                                        placeholder="Enter Pincode"
                                        value={pincode}
                                        onChange={(e) => setPincode(e.target.value)}
                                        className="flex-1 rounded-xl border-slate-200 bg-white px-4 h-10 text-sm focus-visible:ring-primary-500 dark:bg-slate-900 dark:border-slate-800"
                                    />
                                    <Button onClick={checkDelivery} className="bg-slate-900 text-white px-6 h-10 rounded-xl text-sm font-bold hover:bg-primary-600 transition-all">
                                        Check
                                    </Button>
                                </div>
                                {isCheckSuccess !== null && (
                                    <p className={cn("mt-2 text-[10px] font-bold uppercase tracking-wider", isCheckSuccess ? "text-green-600" : "text-red-600")}>
                                        {isCheckSuccess ? 'Delivery available for this location' : 'Invalid pincode'}
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Features Info */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t md:border-none">
                            {[
                                { icon: Truck, label: 'Free Shipping', sub: 'Orders over $50' },
                                { icon: ShieldCheck, label: '1 Year Warranty', sub: 'Nexus Assured' },
                                { icon: RefreshCw, label: 'Easy Returns', sub: '30 Days window' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-900/20">
                                        <item.icon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-900 uppercase dark:text-white leading-none">{item.label}</p>
                                        <p className="text-[10px] text-slate-400 mt-1">{item.sub}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Specifications */}
                        <div className="space-y-4 pt-6 border-t">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">Product Specifications</h3>
                            <div className="grid grid-cols-1 gap-0">
                                {Object.entries(product.specifications).map(([key, value]) => (
                                    <div key={key} className="flex border-b border-slate-100 py-3 dark:border-slate-800 last:border-none">
                                        <span className="w-1/3 text-xs font-medium text-slate-400 uppercase tracking-widest leading-none">{key}</span>
                                        <span className="text-sm font-semibold text-slate-900 dark:text-white leading-none">{value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
