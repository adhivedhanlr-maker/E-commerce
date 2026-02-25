'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
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

const categories = [
    { name: 'For You', icon: Sparkles, href: '/shop?cat=for-you' },
    { name: 'Fashion', icon: Shirt, href: '/shop?cat=fashion' },
    { name: 'Appliances', icon: Tv, href: '/shop?cat=appliances' },
    { name: 'Mobiles', icon: Smartphone, href: '/shop?cat=mobiles' },
    { name: 'Electronics', icon: Cpu, href: '/shop?cat=electronics' },
    { name: 'Smart Gadgets', icon: Watch, href: '/shop?cat=gadgets' },
    { name: 'Home', icon: HomeIcon, href: '/shop?cat=home' },
    { name: 'Beauty & Personal Care', icon: Palette, href: '/shop?cat=beauty' },
    { name: 'Toys & Baby Care', icon: Baby, href: '/shop?cat=toys' },
    { name: 'Food & Healthcare', icon: Utensils, href: '/shop?cat=food' },
    { name: 'Sports & Fitness', icon: Dumbbell, href: '/shop?cat=sports' },
    { name: 'Auto Accessories', icon: Car, href: '/shop?cat=auto' },
    { name: 'Furniture', icon: Armchair, href: '/shop?cat=furniture' },
    { name: 'Bikes & Scooters', icon: Bike, href: '/shop?cat=bikes' },
    { name: 'Travel', icon: Plane, href: '/shop?cat=travel' },
    { name: 'Books & Media', icon: Book, href: '/shop?cat=books' },
    { name: 'Gift Cards', icon: Ticket, href: '/shop?cat=gifts' },
    { name: 'Sell/Exchange Old Devices', icon: RefreshCcw, href: '/sell' },
    { name: 'Home Services', icon: Hammer, href: '/services' },
];

const CategoryBar = () => {
    return (
        <div className="w-full bg-background border-b border-slate-200 dark:border-white/5 sticky top-[56px] z-40">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="relative">
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-4 scroll-smooth">
                        {categories.map((category) => (
                            <Link key={category.name} href={category.href}>
                                <motion.div
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all",
                                        "bg-secondary-100 hover:bg-secondary-200 dark:bg-white/5 dark:hover:bg-white/10",
                                        "border border-transparent hover:border-primary-500/30",
                                        "group cursor-pointer"
                                    )}
                                >
                                    <category.icon className="w-4 h-4 text-slate-500 group-hover:text-primary-600 transition-colors" />
                                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                                        {category.name}
                                    </span>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                    {/* Shadow indicators for mobile scroll */}
                    <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent pointer-events-none md:hidden" />
                    <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none md:hidden" />
                </div>
            </div>
        </div>
    );
};

export default CategoryBar;
