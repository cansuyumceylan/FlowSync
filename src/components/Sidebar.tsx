import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { LayoutDashboard, Calendar, Settings, LogOut, Zap, Clock, PieChart, StickyNote } from 'lucide-react';
import { useAuth } from '@/store/useAuth';

const navItems = [
    { icon: LayoutDashboard, label: 'Focus', path: '/dashboard' },
    { icon: Calendar, label: 'Calendar', path: '/dashboard/calendar' },
    { icon: PieChart, label: 'Analytics', path: '/dashboard/analytics' },
    { icon: StickyNote, label: 'Notes', path: '/dashboard/notes' },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { signOut } = useAuth();

    return (
        <motion.div 
            initial={{ x: -250, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="w-64 glass-card h-full flex flex-col border-r border-white/5"
        >
            <div className="p-8">
                <h1 className="text-2xl font-space font-bold tracking-tight text-white flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-mint animate-pulse" />
                    FlowSync
                </h1>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                        <Link key={item.path} href={item.path}>
                            <div className={`
                                relative px-4 py-3 rounded-xl flex items-center gap-3 transition-all duration-300 group
                                ${isActive ? 'text-charcoal font-bold' : 'text-white/60 hover:text-white hover:bg-white/5'}
                            `}>
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-mint rounded-xl"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <item.icon className={`w-5 h-5 relative z-10 ${isActive ? 'text-charcoal' : 'text-current group-hover:text-mint'}`} />
                                <span className="relative z-10">{item.label}</span>
                            </div>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-white/5">
                <button 
                  onClick={() => signOut()}
                  className="w-full px-4 py-3 rounded-xl flex items-center gap-3 text-white/60 hover:text-red-400 hover:bg-red-400/10 transition-all font-medium"
                >
                    <LogOut className="w-5 h-5" />
                    <span>Sign Out</span>
                </button>
            </div>
        </motion.div>
    );
}
