'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, ShoppingCart, User, X, Heart, LogOut, Settings, ChevronDown, LayoutGrid, Zap, BookOpen, ShoppingBag, Menu } from 'lucide-react';

import { motion, AnimatePresence, useScroll } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAuth } from '@/store/useAuth';
import { useCart } from '@/store/useCart';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { getProducts } from '@/services/productService';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface SuggestionProduct {
    _id: string;
    name: string;
    price: number;
    images: string[];
}

const Navbar = () => {
    const [hasMounted, setHasMounted] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const { user, logout } = useAuth();
    const { cartItems } = useCart();
    const pathname = usePathname();
    const router = useRouter();
    const { scrollY } = useScroll();

    const [isScrolled, setIsScrolled] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState<SuggestionProduct[]>([]);
    const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
    const searchRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        setHasMounted(true);
        return scrollY.on('change', (latest) => {
            setIsScrolled(latest > 20);
        });
    }, [scrollY]);

    // Debounced search for suggestions
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (searchQuery.length < 2) {
                setSuggestions([]);
                setIsSuggestionsOpen(false);
                return;
            }

            setIsLoadingSuggestions(true);
            try {
                const response = await getProducts({ keyword: searchQuery, pageSize: 6 });
                // Robust response handling for the deeper nested API shape
                const products = response?.data?.data?.products || response?.data?.products || response?.products || response || [];
                setSuggestions(Array.isArray(products) ? products : []);
                setIsSuggestionsOpen(true);
            } catch (error) {
                console.error('Error fetching suggestions:', error);
                setSuggestions([]);
            } finally {
                setIsLoadingSuggestions(false);
            }
        };

        const debounceTimer = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(debounceTimer);
    }, [searchQuery]);

    // Handle clicking outside of search suggestions
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsSuggestionsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSuggestionClick = (productId: string) => {
        router.push(`/product/${productId}`);
        setIsSuggestionsOpen(false);
        setSearchQuery('');
        setIsSearchOpen(false);
    };

    const handleSearchSubmit = (e?: React.FormEvent | React.MouseEvent) => {
        if (e && 'preventDefault' in e) e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/shop?keyword=${encodeURIComponent(searchQuery.trim())}`);
            setIsSuggestionsOpen(false);
            setIsSearchOpen(false);
        }
    };

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
                {/* Mobile Hamburger Menu - Left on Mobile */}
                <div className="lg:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon-lg" className="group rounded-full text-slate-600 hover:text-primary-600 dark:text-slate-400 dark:hover:text-white transition-all">
                                <Menu className="h-[24px] w-[24px]" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[300px] p-0 border-r-0 bg-white dark:bg-slate-900 shadow-2xl">
                            <SheetHeader className="p-6 border-b border-secondary-100 dark:border-white/5">
                                <SheetTitle className="text-left font-accent text-xl font-bold tracking-tight text-slate-950 dark:text-white">
                                    Nexus<span className="text-primary-600">Store</span>
                                </SheetTitle>
                            </SheetHeader>
                            <div className="flex flex-col py-6">
                                {navLinks.map((link) => {
                                    const isActive = pathname === link.href;
                                    return (
                                        <Link
                                            key={link.name}
                                            href={link.href}
                                            className={cn(
                                                "flex items-center space-x-4 px-6 py-4 text-sm font-bold uppercase tracking-[0.1em] transition-all",
                                                isActive
                                                    ? "bg-primary-50 text-primary-600 dark:bg-primary-600/10"
                                                    : "text-slate-600 hover:text-primary-600 dark:text-slate-400 dark:hover:text-white"
                                            )}
                                        >
                                            <link.icon className={cn("h-5 w-5", isActive ? "text-primary-600" : "text-slate-400")} />
                                            <span>{link.name}</span>
                                        </Link>
                                    );
                                })}
                                <div className="mt-8 px-6 pt-8 border-t border-secondary-100 dark:border-white/5">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-primary-600 mb-6">Categories</p>
                                    <div className="space-y-4">
                                        <Link href="/shop?cat=electronics" className="block text-sm font-medium text-slate-600 hover:text-primary-600 dark:text-slate-400">Electronics</Link>
                                        <Link href="/shop?cat=fashion" className="block text-sm font-medium text-slate-600 hover:text-primary-600 dark:text-slate-400">Apparel</Link>
                                        <Link href="/shop?cat=home" className="block text-sm font-medium text-slate-600 hover:text-primary-600 dark:text-slate-400">Furniture</Link>
                                    </div>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>

                {/* Logo Section - Centered on Mobile, Left on Desktop */}
                <div className="absolute left-1/2 -translate-x-1/2 lg:relative lg:left-0 lg:translate-x-0">
                    <Link href="/" className="group relative">
                        <span className="font-accent text-xl lg:text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
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
                                        <div className="space-y-1 flex flex-col">
                                            <DropdownMenuItem asChild>
                                                <Link href="/shop?cat=electronics" className="text-sm text-slate-600 hover:text-primary-600 dark:text-slate-400 py-1.5 transition-colors">Electronics</Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link href="/shop?cat=fashion" className="text-sm text-slate-600 hover:text-primary-600 dark:text-slate-400 py-1.5 transition-colors">Apparel</Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link href="/shop?cat=home" className="text-sm text-slate-600 hover:text-primary-600 dark:text-slate-400 py-1.5 transition-colors">Furniture</Link>
                                            </DropdownMenuItem>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-primary-600">Featured</p>
                                        <div className="space-y-1 flex flex-col">
                                            <DropdownMenuItem asChild>
                                                <Link href="/shop" className="text-sm text-slate-600 hover:text-primary-600 dark:text-slate-400 py-1.5 transition-colors">New Arrivals</Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link href="/shop" className="text-sm text-slate-600 hover:text-primary-600 dark:text-slate-400 py-1.5 transition-colors">Bestsellers</Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link href="/shop" className="text-sm text-slate-600 hover:text-primary-600 dark:text-slate-400 py-1.5 transition-colors">Summer Sale</Link>
                                            </DropdownMenuItem>
                                        </div>
                                    </div>
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>

                {/* Right Utilities */}
                <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">

                    {/* Search - Expandable on Mobile */}
                    <div className="flex items-center" ref={searchRef}>
                        <div className={cn(
                            "group relative flex items-center h-10 px-3 transition-all",
                            "hidden lg:flex" // Keep desktop behavior
                        )}>
                            <button
                                onClick={() => handleSearchSubmit()}
                                className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                            >
                                <Search className="h-4 w-4 text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white" />
                            </button>
                            <input
                                type="text"
                                placeholder="Search catalogue..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => searchQuery.length >= 2 && setIsSuggestionsOpen(true)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
                                className="bg-transparent border-none focus:ring-0 text-[13px] ml-2 w-36 placeholder:text-slate-400 dark:text-white transition-all focus:w-48"
                            />

                            {/* Suggestions Dropdown (Desktop) */}
                            <AnimatePresence>
                                {isSuggestionsOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.98 }}
                                        transition={{ duration: 0.2, ease: "easeOut" }}
                                        className="absolute top-12 left-1/2 -translate-x-1/2 w-[450px] bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-3xl shadow-premium border border-slate-100 dark:border-white/5 overflow-hidden z-50 p-4"
                                    >
                                        {isLoadingSuggestions ? (
                                            <div className="py-12 flex flex-col items-center justify-center space-y-4">
                                                <div className="relative">
                                                    <div className="h-10 w-10 rounded-full border-2 border-primary-100 dark:border-primary-900/30"></div>
                                                    <div className="absolute top-0 h-10 w-10 rounded-full border-2 border-primary-600 border-t-transparent animate-spin"></div>
                                                </div>
                                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 animate-pulse">Searching Catalogue</p>
                                            </div>
                                        ) : suggestions.length > 0 ? (
                                            <div className="space-y-1">
                                                <div className="px-3 py-2 mb-2">
                                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-600/70">Top Matches</p>
                                                </div>
                                                <div className="grid gap-1">
                                                    {suggestions.map((product) => (
                                                        <button
                                                            key={product._id}
                                                            onClick={() => handleSuggestionClick(product._id)}
                                                            className="group w-full flex items-center p-3 hover:bg-primary-50 dark:hover:bg-primary-600/10 rounded-2xl transition-all duration-300 text-left"
                                                        >
                                                            <div className="h-14 w-14 rounded-xl overflow-hidden bg-slate-100 dark:bg-white/5 flex-shrink-0 relative">
                                                                {product.images?.[0] ? (
                                                                    <Image
                                                                        src={product.images[0]}
                                                                        alt={product.name}
                                                                        width={56}
                                                                        height={56}
                                                                        className="object-cover h-full w-full transition-transform duration-500 group-hover:scale-110"
                                                                    />
                                                                ) : (
                                                                    <div className="h-full w-full bg-slate-200 dark:bg-white/10" />
                                                                )}
                                                            </div>
                                                            <div className="ml-4 flex-1 overflow-hidden">
                                                                <p className="text-sm font-bold text-slate-950 dark:text-white truncate group-hover:text-primary-600 transition-colors">
                                                                    {product.name}
                                                                </p>
                                                                <div className="flex items-center mt-1 space-x-3">
                                                                    <p className="text-sm font-medium text-slate-900 dark:text-slate-300">${product.price}</p>
                                                                    <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                                                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">In Stock</p>
                                                                </div>
                                                            </div>
                                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                                                                <Zap className="h-4 w-4 text-primary-600" />
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                                <button
                                                    onClick={() => handleSearchSubmit()}
                                                    className="w-full mt-2 py-4 text-[10px] font-black uppercase tracking-[0.25em] text-slate-500 hover:text-white hover:bg-primary-600 transition-all duration-300 rounded-2xl border-t border-slate-100 dark:border-white/5"
                                                >
                                                    View All Results for &quot;{searchQuery}&quot;
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="py-12 flex flex-col items-center justify-center space-y-3">
                                                <div className="h-12 w-12 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center">
                                                    <Search className="h-5 w-5 text-slate-300" />
                                                </div>
                                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">No results found</p>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Mobile Search Button */}
                        <div className="lg:hidden flex items-center">
                            <AnimatePresence>
                                {isSearchOpen && (
                                    <motion.div
                                        initial={{ width: 0, opacity: 0 }}
                                        animate={{ width: "calc(100vw - 32px)", opacity: 1 }}
                                        exit={{ width: 0, opacity: 0 }}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-lg rounded-full h-12 flex items-center dark:bg-slate-900/80 border border-slate-100 dark:border-white/5 z-[60]"
                                    >
                                        <div className="pl-4 pr-2">
                                            <Search className="h-4 w-4 text-slate-400" />
                                        </div>
                                        <input
                                            autoFocus
                                            type="text"
                                            placeholder="Search products..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            onFocus={() => searchQuery.length >= 2 && setIsSuggestionsOpen(true)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
                                            className="bg-transparent border-none focus:ring-0 text-sm w-full dark:text-white"
                                        />
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => { setIsSearchOpen(false); setSearchQuery(''); setIsSuggestionsOpen(false); }}
                                            className="mr-2 rounded-full hover:bg-secondary-100 dark:hover:bg-white/5"
                                        >
                                            <X className="h-4 w-4 text-slate-500" />
                                        </Button>

                                        {/* Suggestions Dropdown (Mobile) */}
                                        <AnimatePresence>
                                            {isSuggestionsOpen && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: 10 }}
                                                    className="absolute top-14 left-0 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-secondary-200/50 dark:border-white/10 overflow-hidden z-50 p-2"
                                                >
                                                    {isLoadingSuggestions ? (
                                                        <div className="py-8 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                            Searching...
                                                        </div>
                                                    ) : suggestions.length > 0 ? (
                                                        <div className="space-y-1">
                                                            {suggestions.map((product) => (
                                                                <button
                                                                    key={product._id}
                                                                    onClick={() => handleSuggestionClick(product._id)}
                                                                    className="w-full flex items-center p-3 hover:bg-secondary-50 dark:hover:bg-white/5 rounded-xl transition-colors text-left"
                                                                >
                                                                    <div className="h-12 w-12 rounded-lg overflow-hidden bg-secondary-100 dark:bg-white/5 flex-shrink-0">
                                                                        {product.images?.[0] ? <Image src={product.images[0]} alt={product.name} width={48} height={48} className="object-cover h-full w-full" /> : <div className="h-full w-full bg-secondary-200 dark:bg-white/10" />}
                                                                    </div>
                                                                    <div className="ml-3 overflow-hidden">
                                                                        <p className="text-xs font-bold text-slate-950 dark:text-white truncate">{product.name}</p>
                                                                        <p className="text-[10px] text-primary-600 font-medium">${product.price}</p>
                                                                    </div>
                                                                </button>
                                                            ))}
                                                            <button
                                                                onClick={() => handleSearchSubmit()}
                                                                className="block w-full text-center py-3 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-primary-600 transition-colors border-t border-secondary-100 dark:border-white/5 mt-1"
                                                            >
                                                                View All Results
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="py-8 text-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                                                            No products found
                                                        </div>
                                                    )}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            {!isSearchOpen && (
                                <Button variant="ghost" size="icon-lg" onClick={() => setIsSearchOpen(true)} className="rounded-full">
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
                            <Button variant="ghost" size="icon-lg" className="relative group rounded-full text-slate-600 hover:text-primary-600 dark:text-slate-400 dark:hover:text-white transition-all">
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
