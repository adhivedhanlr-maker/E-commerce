'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { BookOpen, Calendar, Clock, ChevronRight } from 'lucide-react';
import Image from 'next/image';

const articles = [
    {
        id: 1,
        title: "The Materiality of Time: Why We Build For Longevity",
        category: "Philosophy",
        date: "Feb 21, 2026",
        readTime: "08 Min",
        excerpt: "Exploring the intersection of industrial design and human emotion through our latest archival explorations.",
        image: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 2,
        title: "Symphony of Silence: Designing the Aura Pods Elite",
        category: "Process",
        date: "Feb 15, 2026",
        readTime: "12 Min",
        excerpt: "A deep dive into the acoustic engineering that defines our flagship audio collection.",
        image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 3,
        title: "Winter Edit: The Modern Nomad's Toolkit",
        category: "Curation",
        date: "Feb 08, 2026",
        readTime: "06 Min",
        excerpt: "Essential carry items for the discerning traveler navigating the urban landscape.",
        image: "https://images.unsplash.com/photo-1454165833267-02d99d784c04?auto=format&fit=crop&q=80&w=800"
    }
];

export default function JournalPage() {
    return (
        <div className="bg-white dark:bg-slate-950 pt-32 pb-24">
            <div className="mx-auto max-w-7xl px-6 lg:px-12">
                {/* Header */}
                <div className="mb-24 flex flex-col items-center text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center space-x-2 text-primary-600 mb-6 font-black uppercase tracking-[0.4em] text-[10px]">
                            <BookOpen className="h-3.5 w-3.5" />
                            <span>Editorial Journal</span>
                        </div>
                        <h1 className="font-accent text-6xl md:text-8xl font-bold tracking-tight text-slate-950 dark:text-white mb-8">
                            Volume <span className="italic font-light text-secondary-400">01</span>
                        </h1>
                        <p className="max-w-2xl text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-light">
                            Thoughtful explorations in design, technology, and the modern lifestyle. <br />
                            A space for the curious and the discerning.
                        </p>
                    </motion.div>
                </div>

                {/* Featured Horizontal Article */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-32 group cursor-pointer"
                >
                    <div className="relative aspect-[16/10] overflow-hidden rounded-[40px] shadow-premium">
                        <Image
                            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200"
                            alt="The Art of Focus"
                            fill
                            className="object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                    </div>
                    <div className="lg:pl-8">
                        <div className="flex items-center gap-6 mb-6">
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary-600">Featured Story</span>
                            <span className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-950 dark:text-white mb-6 leading-tight">The Art of Focus in a Digital Age</h2>
                        <p className="text-slate-600 dark:text-slate-400 text-lg mb-8 leading-relaxed italic font-light">
                            &quot;True craftsmanship requires the elimination of distraction. We explore how environment affects the creative output of the modern architect.&quot;
                        </p>
                        <div className="flex items-center gap-8 mb-10 text-[11px] font-black uppercase tracking-widest text-slate-400">
                            <span className="flex items-center gap-2"><Clock className="h-3 w-3" /> 15 Min</span>
                            <span className="flex items-center gap-2"><Calendar className="h-3 w-3" /> Architecture</span>
                        </div>
                        <Button variant="ghost" className="p-0 text-slate-950 dark:text-white hover:text-primary-600 dark:hover:text-primary-600 group flex items-center gap-3 font-black uppercase tracking-widest text-xs h-auto">
                            Read Article <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-2" />
                        </Button>
                    </div>
                </motion.div>

                {/* Grid Listing */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                    {articles.map((article, idx) => (
                        <motion.div
                            key={article.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: idx * 0.1 }}
                            className="group cursor-pointer"
                        >
                            <div className="relative aspect-[4/5] overflow-hidden rounded-[32px] mb-8 shadow-sm transition-all group-hover:shadow-premium group-hover:-translate-y-2">
                                <Image
                                    src={article.image}
                                    alt={article.title}
                                    fill
                                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-[0.2em] text-primary-600">
                                    <span>{article.category}</span>
                                    <span className="h-1 w-1 bg-slate-300 dark:bg-white/20 rounded-full" />
                                    <span className="text-slate-400">{article.date}</span>
                                </div>
                                <h3 className="text-2xl font-bold text-slate-950 dark:text-white group-hover:text-primary-600 transition-colors leading-tight">
                                    {article.title}
                                </h3>
                                <p className="text-secondary-400 font-light mt-4 italic">&quot;A meticulously curated home is not just about furniture; it&rsquo;s about creating a landscape where your soul can rest.&quot;</p>
                                <div className="pt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white transform transition-all group-hover:gap-4">
                                    Continue Reading <ChevronRight className="h-3 w-3" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Newsletter Section Re-used/Refined */}
                <div className="mt-40 pt-24 border-t border-slate-200 dark:border-white/5 text-center">
                    <h2 className="font-accent text-3xl font-bold text-slate-950 dark:text-white mb-6">Never Miss a Volume</h2>
                    <p className="text-slate-500 mb-10 max-w-md mx-auto italic font-light">Join the 12,000+ creators who receive our bi-weekly editorial digest.</p>
                    <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                        <input
                            type="email"
                            placeholder="Email Address"
                            className="flex-1 bg-slate-100 dark:bg-white/5 border-none rounded-2xl h-14 px-6 text-sm outline-none focus:ring-2 focus:ring-primary-600 transition-all"
                        />
                        <Button className="h-14 px-8 rounded-2xl bg-slate-950 dark:bg-white dark:text-slate-950 font-bold text-xs uppercase tracking-widest">
                            Join Journal
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
