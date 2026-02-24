'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingBag, Star, BookOpen, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
    { label: 'Home', icon: Home, href: '/' },
    { label: 'Shop', icon: ShoppingBag, href: '/shop' },
    { label: 'Featured', icon: Star, href: '/featured' },
    { label: 'Journal', icon: BookOpen, href: '/journal' },
    { label: 'Profile', icon: User, href: '/profile' },
];

const BottomNav = () => {
    const pathname = usePathname();

    return (
        <nav className={cn(
            "fixed bottom-6 left-6 right-6 z-[1000] h-[65px] md:hidden",
            "rounded-full border border-white/10 shadow-premium liquid-glass"
        )}>
            <div className="flex justify-around items-center h-full px-4">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center space-y-1 min-w-[56px] transition-all duration-300",
                                isActive
                                    ? "text-primary-600 scale-110 drop-shadow-[0_0_8px_rgba(50,118,66,0.3)]"
                                    : "text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                            )}
                        >
                            <Icon size={20} className={cn("transition-transform", isActive ? "stroke-[2.5px]" : "stroke-[1.5px]")} />
                            <span className="text-[9px] font-black uppercase tracking-widest">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};

export default BottomNav;
