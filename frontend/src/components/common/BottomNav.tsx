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
        <nav className="fixed bottom-0 left-0 right-0 z-[1000] h-[65px] bg-white dark:bg-slate-900 border-t border-secondary-100 dark:border-white/5 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] md:hidden">
            <div className="flex justify-around items-center h-full px-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center space-y-1 min-w-[64px] transition-colors",
                                isActive
                                    ? "text-primary-600"
                                    : "text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                            )}
                        >
                            <Icon size={20} className={cn("transition-transform", isActive && "scale-110")} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};

export default BottomNav;
