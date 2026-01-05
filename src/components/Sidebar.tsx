"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { LayoutDashboard, Calendar, Settings, LogOut, Zap, Clock, PieChart } from 'lucide-react';
import { useAuth } from '@/store/useAuth';

const navItems = [
  { icon: LayoutDashboard, label: 'Focus', path: '/dashboard' },
  { icon: Calendar, label: 'Calendar', path: '/dashboard/calendar' },
  { icon: PieChart, label: 'Analytics', path: '/dashboard/analytics' },
  { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { signOut } = useAuth();

  return (
    <aside className="w-64 h-screen bg-charcoal border-r border-white/5 flex flex-col fixed left-0 top-0 z-20">
      <div className="p-6 flex items-center gap-3">
        <div className="h-8 w-8 bg-mint rounded-lg flex items-center justify-center">
          <Zap className="h-5 w-5 text-charcoal" />
        </div>
        <span className="text-2xl font-space font-bold text-white">FlowSync</span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link key={item.path} href={item.path}>
              <div className={`relative px-4 py-3 rounded-xl flex items-center gap-3 transition-all group ${
                isActive ? 'text-charcoal' : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-mint rounded-xl"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon className={`w-5 h-5 relative z-10 ${isActive ? 'text-charcoal' : ''}`} />
                <span className={`font-medium relative z-10 ${isActive ? 'text-charcoal' : ''}`}>{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <button 
          onClick={() => signOut()}
          className="w-full px-4 py-3 rounded-xl flex items-center gap-3 text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
