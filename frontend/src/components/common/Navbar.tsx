'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, ShoppingCart, User, Menu, X, Heart, LogOut, Settings, ChevronDown, LayoutGrid, Zap, BookOpen, ShoppingBag } from 'lucide-react';
import ThemeSwitcher from '@/components/common/ThemeSwitcher';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAuth } from '@/store/useAuth';
import { useCart } from '@/store/useCart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

const Navbar = () => {
    const [hasMounted, setHasMounted] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const { user, logout } = useAuth();
    const { cartItems } = useCart();
    const pathname = usePathname();
    const { scrollY } = useScroll();

    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        setHasMounted(true);
        return scrollY.on('change', (latest) => {
            setIsScrolled(latest > 20);
        });
    }, [scrollY]);

    const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

    const navLinks = [
        { name: 'Collections', href: '/shop', icon: LayoutGrid },
        { name: 'Featured', href: '/deals', icon: Zap },
        { name: 'Journal', href: '/journal', icon: BookOpen },
    ];

    return (
        <nav
            className={cn(
                "fixed top-0 z-50 w-full transition-all duration-500 ease-in-out",
                isScrolled
                    ? "py-3 bg-white/70 backdrop-blur-xl border-b border-secondary-200/50 shadow-premium dark:bg-black/70 dark:border-white/10"
                    : "py-6 bg-transparent"
            )}
        >
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-12 relative">
                {/* Logo Section - Left on Desktop, Centered on Mobile */}
                <div className="absolute left-1/2 -translate-x-1/2 lg:relative lg:left-0 lg:translate-x-0">
                    <Link href="/" className="group relative">
                        <span className="font-accent text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
                            Nexus<span className="text-primary-600 transition-colors group-hover:text-primary-700">Store</span>
                        </span>
                        <div className="absolute -bottom-1 left-0 h-0.5 w-0 bg-primary-600 transition-all duration-300 group-hover:w-full" />
                    </Link>
                </div>

                {/* Hidden Navigation Links for Desktop */}
                <div className="hidden lg:flex items-center space-x-12">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={cn(
                                    "group relative flex items-center space-x-2 text-[11px] font-black uppercase tracking-[0.2em] transition-colors",
                                    isActive ? "text-slate-950 dark:text-white" : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                                )}
                            >
                                <link.icon className={cn(
                                    "h-3.5 w-3.5 transition-colors",
                                    isActive ? "text-primary-600" : "text-primary-600/60 group-hover:text-primary-600"
                                )} />
                                <span>{link.name}</span>
                                <span className={cn(
                                    "absolute -bottom-2 left-1/2 h-[1px] -translate-x-1/2 bg-primary-600 transition-all duration-300",
                                    isActive ? "w-full" : "w-0 group-hover:w-full"
                                )} />
                            </Link>
                        );
                    })}
                    {hasMounted && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className={cn(
                                    "group flex items-center space-x-2 text-[11px] font-black uppercase tracking-[0.2em] outline-none transition-colors",
                                    pathname.startsWith('/shop') ? "text-slate-950 dark:text-white" : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                                )}>
                                    <ShoppingBag className={cn(
                                        "h-3.5 w-3.5 transition-colors",
                                        pathname.startsWith('/shop') ? "text-primary-600" : "text-primary-600/60 group-hover:text-primary-600"
                                    )} />
                                    <span>Shop</span>
                                    <ChevronDown className="h-3 w-3 transition-transform group-data-[state=open]:rotate-180" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="center" className="w-[400px] p-6 rounded-2xl shadow-premium border-secondary-200/50 bg-white/95 backdrop-blur-lg dark:bg-slate-900/95 dark:border-white/10">
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-primary-600">Categories</p>
                                        <div className="space-y-2 flex flex-col">
                                            <Link href="/shop?cat=electronics" className="text-sm text-slate-600 hover:text-primary-600 dark:text-slate-400">Electronics</Link>
                                            <Link href="/shop?cat=fashion" className="text-sm text-slate-600 hover:text-primary-600 dark:text-slate-400">Fashion</Link>
                                            <Link href="/shop?cat=home" className="text-sm text-slate-600 hover:text-primary-600 dark:text-slate-400">Home & Living</Link>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-primary-600">Featured</p>
                                        <div className="space-y-2 flex flex-col">
                                            <Link href="/shop" className="text-sm text-slate-600 hover:text-primary-600 dark:text-slate-400">New Arrivals</Link>
                                            <Link href="/shop" className="text-sm text-slate-600 hover:text-primary-600 dark:text-slate-400">Bestsellers</Link>
                                            <Link href="/shop" className="text-sm text-slate-600 hover:text-primary-600 dark:text-slate-400">Summer Sale</Link>
                                        </div>
                                    </div>
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>

                {/* Right Utilities */}
                <div className="flex items-center space-x-2 md:space-x-4">
                    {/* Theme Switcher - Desktop only */}
                    <div className="hidden lg:block">
                        <ThemeSwitcher />
                    </div>
                    {/* Search - Expandable on Mobile */}
                    <div className="flex items-center">
                        <div className={cn(
                            "group relative flex items-center bg-secondary-100 rounded-full h-10 px-4 transition-all hover:bg-secondary-200 dark:bg-white/5 dark:hover:bg-white/10",
                            "hidden lg:flex" // Keep desktop behavior
                        )}>
                            <Search className="h-4 w-4 text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white" />
                            <input
                                type="text"
                                placeholder="Search our catalog..."
                                className="bg-transparent border-none focus:ring-0 text-[13px] ml-2 w-40 placeholder:text-slate-400 dark:text-white"
                            />
                        </div>

                        {/* Mobile Search Button */}
                        <div className="lg:hidden flex items-center">
                            <AnimatePresence>
                                {isSearchOpen && (
                                    <motion.div
                                        initial={{ width: 0, opacity: 0 }}
                                        animate={{ width: "calc(100vw - 120px)", opacity: 1 }}
                                        exit={{ width: 0, opacity: 0 }}
                                        className="absolute right-24 bg-secondary-100 rounded-full h-10 px-4 flex items-center dark:bg-white/10"
                                    >
                                        <input
                                            autoFocus
                                            type="text"
                                            placeholder="Search..."
                                            className="bg-transparent border-none focus:ring-0 text-sm w-full dark:text-white"
                                        />
                                        <X className="h-4 w-4 text-slate-500 ml-2 cursor-pointer" onClick={() => setIsSearchOpen(false)} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            {!isSearchOpen && (
                                <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)} className="rounded-full">
                                    <Search className="h-[20px] w-[20px] stroke-[1.5px]" />
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center space-x-1">
                        <Link href="/wishlist" className="hidden sm:block">
                            <Button variant="ghost" size="icon" className="group rounded-full text-slate-600 hover:text-primary-600 dark:text-slate-400 dark:hover:text-white transition-all">
                                <Heart className="h-[20px] w-[20px] stroke-[1.5px] group-hover:fill-primary-600 group-hover:stroke-primary-600" />
                            </Button>
                        </Link>

                        <Link href="/cart">
                            <Button variant="ghost" size="icon" className="relative group rounded-full text-slate-600 hover:text-primary-600 dark:text-slate-400 dark:hover:text-white transition-all">
                                <ShoppingCart className="h-[20px] w-[20px] stroke-[1.5px]" />
                                {hasMounted && cartCount > 0 && (
                                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary-600 text-[10px] font-bold text-white">
                                        {cartCount}
                                    </span>
                                )}
                            </Button>
                        </Link>

                        {hasMounted && user ? (
                            <div className="hidden lg:block">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="flex items-center outline-none ml-2">
                                            <div className="h-8 w-8 rounded-full border-2 border-secondary-200 p-0.5 overflow-hidden transition-all hover:border-primary-600 dark:border-white/10">
                                                <div className="h-full w-full rounded-full bg-slate-900 flex items-center justify-center text-[10px] text-white font-bold dark:bg-white dark:text-black">
                                                    {user.name.charAt(0)}
                                                </div>
                                            </div>
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl shadow-premium border-secondary-200/50">
                                        <DropdownMenuLabel className="font-accent">My Account</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="rounded-lg">
                                            <User className="mr-2 h-4 w-4 stroke-[1.5px]" />
                                            <span>Profile</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="rounded-lg">
                                            <Settings className="mr-2 h-4 w-4 stroke-[1.5px]" />
                                            <span>Settings</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={logout} className="text-red-500 focus:text-red-500 rounded-lg">
                                            <LogOut className="mr-2 h-4 w-4 stroke-[1.5px]" />
                                            <span>Logout</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        ) : hasMounted ? (
                            <Link href="/login" className="hidden lg:block">
                                <Button variant="ghost" className="text-[13px] font-bold uppercase tracking-[0.15em] ml-2">
                                    Login
                                </Button>
                            </Link>
                        ) : null}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
