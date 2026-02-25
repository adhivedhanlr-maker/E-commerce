'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    Search,
    Sparkles,
    Shirt,
    Tv,
    Smartphone,
    Cpu,
    Watch,
    Home as HomeIcon,
    Palette,
    Baby,
    Utensils,
    Dumbbell,
    Car,
    Armchair,
    Bike,
    Plane,
    Book,
    Ticket,
    RefreshCcw,
    Hammer
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const categories = [
    { name: 'For You', icon: Sparkles, id: 'for-you', href: '/shop?cat=for-you' },
    { name: 'Fashion', icon: Shirt, id: 'fashion', href: '/shop?cat=fashion' },
    { name: 'Mobiles', icon: Smartphone, id: 'mobiles', href: '/shop?cat=mobiles' },
    { name: 'Beauty', icon: Palette, id: 'beauty', href: '/shop?cat=beauty' },
    { name: 'Electronics', icon: Cpu, id: 'electronics', href: '/shop?cat=electronics' },
    { name: 'Home', icon: HomeIcon, id: 'home', href: '/shop?cat=home' },
    { name: 'Appliances', icon: Tv, id: 'appliances', href: '/shop?cat=appliances' },
    { name: 'Smart Gadgets', icon: Watch, id: 'gadgets', href: '/shop?cat=gadgets' },
    { name: 'Toys', icon: Baby, id: 'toys', href: '/shop?cat=toys' },
    { name: 'Food', icon: Utensils, id: 'food', href: '/shop?cat=food' },
    { name: 'Fitness', icon: Dumbbell, id: 'sports', href: '/shop?cat=sports' },
    { name: 'Auto', icon: Car, id: 'auto', href: '/shop?cat=auto' },
    { name: 'Furniture', icon: Armchair, id: 'furniture', href: '/shop?cat=furniture' },
    { name: 'Bikes', icon: Bike, id: 'bikes', href: '/shop?cat=bikes' },
    { name: 'Travel', icon: Plane, id: 'travel', href: '/shop?cat=travel' },
    { name: 'Books', icon: Book, id: 'books', href: '/shop?cat=books' },
    { name: 'Gifts', icon: Ticket, id: 'gifts', href: '/shop?cat=gifts' },
    { name: 'Sell Device', icon: RefreshCcw, id: 'sell', href: '/sell' },
    { name: 'Services', icon: Hammer, id: 'services', href: '/services' },
];

const CategoryBarContent = () => {
    const searchParams = useSearchParams();
    const activeCat = searchParams.get('cat') || 'for-you';

    return (
        <div className="w-full bg-background border-b border-slate-200 dark:border-white/5 sticky top-[60px] lg:top-[70px] z-40 pb-0 shadow-sm transition-colors duration-300">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Top Search Bar area (As per user image) */}
                <div className="py-5">
                    <div className="relative group max-w-3xl mx-auto">
                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-primary-600 dark:text-primary-400 group-focus-within:text-primary-500 transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search for Products"
                            className="block w-full pl-12 pr-4 py-4 border border-slate-200 dark:border-white/10 rounded-2xl bg-secondary-50 dark:bg-white/5 text-base placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all dark:text-white shadow-sm"
                        />
                    </div>
                </div>

                {/* Categories Row */}
                <div className="relative">
                    <div className="flex items-center gap-6 overflow-x-auto no-scrollbar scroll-smooth">
                        {categories.map((category) => {
                            const isActive = activeCat === category.id;
                            return (
                                <Link key={category.name} href={category.href} className="flex-shrink-0">
                                    <div className="flex flex-col items-center gap-2 group cursor-pointer relative pb-3 min-w-[80px]">
                                        <motion.div
                                            whileHover={{ y: -2 }}
                                            whileTap={{ scale: 0.95 }}
                                            className={cn(
                                                "w-12 h-12 flex items-center justify-center rounded-2xl transition-all relative overflow-hidden",
                                                isActive
                                                    ? "bg-primary-50 dark:bg-primary-600/10 shadow-inner"
                                                    : "bg-transparent group-hover:bg-primary-50/50 dark:group-hover:bg-white/5"
                                            )}
                                        >
                                            <category.icon className={cn(
                                                "w-6 h-6 transition-colors stroke-[1.8px]",
                                                isActive ? "text-primary-600 dark:text-primary-400 fill-primary-400/20" : "text-slate-500 dark:text-slate-400 group-hover:text-primary-600 dark:group-hover:text-primary-400"
                                            )} />
                                        </motion.div>
                                        <span className={cn(
                                            "text-[12px] font-bold tracking-tight transition-colors whitespace-nowrap",
                                            isActive ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400 group-hover:text-primary-600 dark:group-hover:text-primary-400"
                                        )}>
                                            {category.name}
                                        </span>

                                        {/* Active Underline */}
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeCategory"
                                                className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary-600 dark:bg-primary-500 rounded-t-full"
                                                transition={{ type: "spring", stiffness: 350, damping: 30 }}
                                            />
                                        )}
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

const CategoryBar = () => {
    return (
        <React.Suspense fallback={<div className="h-32 bg-white dark:bg-slate-900 animate-pulse" />}>
            <CategoryBarContent />
        </React.Suspense>
    );
};

export default CategoryBar;
