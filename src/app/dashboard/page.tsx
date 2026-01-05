"use client";

import Timer from "@/components/Timer";
import { useAuth } from "@/store/useAuth";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col h-full gap-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-space font-bold mb-1">
            Welcome back, <span className="text-mint">{user?.email?.split('@')[0] || 'Guest'}</span>
          </h1>
          <p className="text-white/60">Let's get into the flow.</p>
        </div>
        <div className="glass-card px-4 py-2 flex items-center gap-2 text-sm">
          <span className="w-2 h-2 rounded-full bg-mint animate-pulse" />
          System Status: Optimal
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Focus Area */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-2 glass-card min-h-[500px] flex flex-col items-center justify-center relative overflow-hidden"
        >
          {/* Background Gradient */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-mint/20 to-transparent" />
          <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-mint/20 to-transparent" />
          
          <Timer />
        </motion.div>

        {/* Side Widgets */}
        <div className="space-y-6">
          {/* Task Summary */}
          <div className="glass-card p-6 h-full">
            <h3 className="font-space font-bold text-lg mb-4">Today's Focus</h3>
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 border-l-2 border-l-mint">
                <p className="font-medium text-sm">Design System Review</p>
                <span className="text-xs text-white/40">10:00 AM - 11:00 AM</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <p className="font-medium text-sm text-white/60">Team Standup</p>
                <span className="text-xs text-white/40">11:30 AM - 12:00 PM</span>
              </div>
              
              <button className="w-full py-2 mt-4 text-sm text-mint border border-mint/20 rounded-lg hover:bg-mint/10 transition-colors">
                + Add Task
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
