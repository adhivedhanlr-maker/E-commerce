import Link from 'next/link';
import { Facebook, Twitter, Instagram, Mail } from 'lucide-react';


const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-background pt-16 sm:pt-24 pb-12 border-t border-secondary-200/50 dark:border-white/5">
            <div className="mx-auto max-w-7xl px-6 lg:px-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16 lg:gap-24">
                    {/* Brand section */}
                    <div className="lg:col-span-1 space-y-6 sm:space-y-8 text-center md:text-left">
                        <Link href="/" className="group inline-block">
                            <span className="font-accent text-2xl font-bold tracking-tight text-slate-950 dark:text-white transition-colors group-hover:text-primary-600">
                                Nexus<span className="text-primary-600 group-hover:text-slate-950 dark:group-hover:text-white transition-colors">Store</span>
                            </span>
                        </Link>
                        <p className="text-slate-500 text-[13px] leading-relaxed max-w-xs font-medium mx-auto md:mx-0">
                            An editorial destination for the modern connoisseur.
                            Curating excellence in craft and innovation since 2026.
                        </p>
                        <div className="flex justify-center md:justify-start space-x-4">
                            {[Instagram, Twitter, Facebook].map((Icon, i) => (
                                <Link
                                    key={i}
                                    href="#"
                                    className="h-10 w-10 rounded-full flex items-center justify-center border border-secondary-200 text-slate-400 transition-all hover:bg-slate-950 hover:text-white hover:border-slate-950 dark:border-white/10 dark:hover:bg-white dark:hover:text-black"
                                >
                                    <Icon className="h-4 w-4 stroke-[1.5px]" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links - Grouped for Mobile */}
                    <div className="space-y-8 md:space-y-8 border-t md:border-t-0 border-secondary-100 pt-8 md:pt-0">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-600 text-center md:text-left">Collections</h3>
                        <ul className="grid grid-cols-2 md:grid-cols-1 gap-4 text-center md:text-left">
                            <li><Link href="/shop" className="text-[13px] font-bold text-slate-600 transition-all hover:text-primary-600 dark:text-slate-400 dark:hover:text-white">New Arrivals</Link></li>
                            <li><Link href="/shop" className="text-[13px] font-bold text-slate-600 transition-all hover:text-primary-600 dark:text-slate-400 dark:hover:text-white">Best Sellers</Link></li>
                            <li><Link href="/deals" className="text-[13px] font-bold text-slate-600 transition-all hover:text-primary-600 dark:text-slate-400 dark:hover:text-white">Archival Pieces</Link></li>
                            <li><Link href="/deals" className="text-[13px] font-bold text-slate-600 transition-all hover:text-primary-600 dark:text-slate-400 dark:hover:text-white">Featured Deals</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div className="space-y-8 border-t md:border-t-0 border-secondary-100 pt-8 md:pt-0">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-600 text-center md:text-left">Service</h3>
                        <ul className="grid grid-cols-2 md:grid-cols-1 gap-4 text-center md:text-left">
                            {['Help Center', 'Shipping Policy', 'Returns', 'Track Order'].map((link) => (
                                <li key={link}>
                                    <Link href="#" className="text-[13px] font-bold text-slate-600 transition-all hover:text-primary-600 dark:text-slate-400 dark:hover:text-white">
                                        {link}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Detail */}
                    <div className="space-y-8 border-t md:border-t-0 border-secondary-100 pt-8 md:pt-0">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-600 text-center md:text-left">Flagship</h3>
                        <div className="flex flex-col sm:flex-row md:flex-col gap-6 text-center md:text-left md:space-y-6">
                            <div className="space-y-1 flex-1">
                                <p className="text-[13px] font-bold text-slate-900 dark:text-white">Inquiry</p>
                                <p className="text-[13px] text-slate-500">support@nexusstore.com</p>
                            </div>
                            <div className="space-y-1 flex-1">
                                <p className="text-[13px] font-bold text-slate-900 dark:text-white">Global</p>
                                <p className="text-[13px] text-slate-500">+1 (888) 555-0123</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-16 sm:mt-24 pt-8 md:pt-12 border-t border-secondary-200/50 flex flex-col md:flex-row justify-between items-center gap-8 dark:border-white/5">
                    <div className="flex flex-col md:flex-row items-center gap-4 md:space-x-8 text-[11px] font-black uppercase tracking-widest text-slate-400">
                        <span>© {currentYear} NexusStore</span>
                        <div className="flex space-x-8">
                            <Link href="#" className="hover:text-primary-600">Privacy</Link>
                            <Link href="#" className="hover:text-primary-600">Terms</Link>
                        </div>
                    </div>

                    <div className="flex items-center space-x-6">
                        <div className="h-px w-12 bg-secondary-200 dark:bg-white/10 hidden md:block" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic text-center">
                            Handcrafted with Excellence
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
