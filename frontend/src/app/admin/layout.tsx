'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/store/useAuth';

const NAV_ITEMS = [
    { href: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard, exact: true },
    { href: '/admin/sellers', label: 'Seller Applications', icon: Users },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, _hasHydrated } = useAuth();

    // Derived state - normalized path check
    const isLoginPage = pathname?.replace(/\/$/, '') === '/admin/login';
    const isAdmin = user?.role === 'admin';

    useEffect(() => {
        // Wait for store to hydrate from storage
        if (!_hasHydrated) return;

        // Skip check for login page
        if (isLoginPage) return;

        console.log('[AdminLayout] Checking access. User:', user?.email, 'Role:', user?.role);

        // Handle redirects
        if (user) {
            if (user.role !== 'admin') {
                console.warn('[AdminLayout] Not an admin, redirecting to home');
                router.push('/');
            }
        } else {
            // If user is genuinely null after hydration, redirect to admin login
            console.warn('[AdminLayout] No user found, redirecting to login');
            router.push('/admin/login');
        }
    }, [user, _hasHydrated, isLoginPage, router]);

    // Render login page without the admin sidebar/shell
    if (isLoginPage) {
        return <>{children}</>;
    }

    // Show loading/verifying state if not hydrated or not an admin
    if (!_hasHydrated || (!isAdmin && !isLoginPage)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#020617]">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
                    <div className="text-slate-400 font-bold tracking-widest uppercase text-xs">
                        {!_hasHydrated ? 'Initializing Session...' : 'Verifying Credentials...'}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#020617] pt-20">
            <div className="flex max-w-7xl mx-auto">
                {/* Sidebar */}
                <aside className="w-64 shrink-0 px-4 py-8 sticky top-20 h-[calc(100vh-5rem)]">
                    <div className="mb-8">
                        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 px-4 mb-2">Admin Panel</p>
                    </div>
                    <nav className="space-y-1">
                        {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
                            const isActive = exact ? pathname === href : pathname.startsWith(href);
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    className={cn(
                                        'flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all',
                                        isActive
                                            ? 'bg-slate-900 text-white shadow-lg'
                                            : 'text-slate-500 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                                    )}
                                >
                                    <Icon className="w-5 h-5 stroke-[2px]" />
                                    {label}
                                </Link>
                            );
                        })}
                    </nav>
                </aside>

                {/* Main content */}
                <main className="flex-1 px-6 py-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
