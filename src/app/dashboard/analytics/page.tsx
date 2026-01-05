"use client";

import { useTaskStore } from '@/store/useTaskStore';
import { useFocusStore } from '@/store/useFocusStore';
import { motion } from 'framer-motion';
import { BarChart, Activity, CheckCircle, Zap } from 'lucide-react';

export default function AnalyticsPage() {
  const tasks = useTaskStore((state) => state.tasks);
  const completedTasks = tasks.filter(t => t.isCompleted).length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  // Mock data for the chart since we don't store history yet
  const weeklyActivity = [45, 60, 30, 90, 120, 60, 45];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-space font-bold mb-1">Analytics</h1>
          <p className="text-white/60">Track your progress and flow.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6 flex flex-col justify-between h-32 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <CheckCircle className="w-16 h-16 text-mint" />
          </div>
          <div>
            <p className="text-white/60 text-sm font-medium">Tasks Completed</p>
            <h3 className="text-3xl font-space font-bold mt-1">{completedTasks}</h3>
          </div>
          <div className="w-full bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
             <div className="h-full bg-mint" style={{ width: `${completionRate}%` }} />
          </div>
        </div>

        <div className="glass-card p-6 flex flex-col justify-between h-32 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10">
            <Activity className="w-16 h-16 text-blue-400" />
          </div>
          <div>
            <p className="text-white/60 text-sm font-medium">Completion Rate</p>
            <h3 className="text-3xl font-space font-bold mt-1">{completionRate}%</h3>
          </div>
          <div className="text-xs text-mint mt-2">+5% from last week</div>
        </div>

        <div className="glass-card p-6 flex flex-col justify-between h-32 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10">
            <Zap className="w-16 h-16 text-yellow-400" />
          </div>
          <div>
            <p className="text-white/60 text-sm font-medium">Focus Streak</p>
            <h3 className="text-3xl font-space font-bold mt-1">3 Days</h3>
          </div>
          <p className="text-xs text-white/40 mt-2">Keep the flow going!</p>
        </div>

        <div className="glass-card p-6 flex flex-col justify-between h-32 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10">
            <BarChart className="w-16 h-16 text-purple-400" />
          </div>
          <div>
            <p className="text-white/60 text-sm font-medium">Total Focus Hours</p>
            <h3 className="text-3xl font-space font-bold mt-1">12.5h</h3>
          </div>
          <p className="text-xs text-white/40 mt-2">This week</p>
        </div>
      </div>

      {/* Activity Chart */}
      <div className="glass-card p-8">
        <h3 className="font-space font-bold text-xl mb-6 flex items-center gap-2">
          <Activity className="w-5 h-5 text-mint" />
          Weekly Activity
        </h3>
        
        <div className="flex items-end justify-between h-[200px] gap-4">
          {weeklyActivity.map((height, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-3">
               <motion.div 
                 initial={{ height: 0 }}
                 animate={{ height: `${(height / 120) * 100}%` }}
                 transition={{ duration: 0.5, delay: i * 0.1 }}
                 className="w-full bg-gradient-to-t from-mint/20 to-mint rounded-t-lg relative group"
               >
                  <div className="absolute -top-8 inset-x-0 text-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    {height}m
                  </div>
               </motion.div>
               <span className="text-xs text-white/40 font-bold uppercase">{days[i]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
