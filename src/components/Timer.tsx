"use client";

import { useEffect } from 'react';
import { useFocusStore } from '@/store/useFocusStore';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw } from 'lucide-react';
import clsx from 'clsx';

export default function Timer() {
  const { 
    timeLeft, 
    isActive, 
    totalDuration, 
    mode, 
    toggleTimer, 
    resetTimer, 
    tick, 
    setMode 
  } = useFocusStore();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        tick();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, tick]);

  const progress = ((totalDuration - timeLeft) / totalDuration) * 100;
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const modes: { id: typeof mode; label: string; icon: string }[] = [
    { id: 'spark', label: 'Spark (25m)', icon: '⚡' },
    { id: 'deepDive', label: 'Deep Dive (50m)', icon: '🌊' },
    { id: 'peakFlow', label: 'Peak Flow (90m)', icon: '🚀' },
  ];

  return (
    <div className="flex flex-col items-center justify-center p-6">
      {/* Mode Selector */}
      <div className="flex bg-white/5 p-1 rounded-2xl mb-12">
        {modes.map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={clsx(
              "px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
              mode === m.id ? "bg-mint text-charcoal shadow-lg" : "text-white/60 hover:text-white"
            )}
          >
            <span>{m.icon}</span> {m.label}
          </button>
        ))}
      </div>

      {/* Timer Circle */}
      <div className="relative mb-12">
        <svg className="transform -rotate-90 w-80 h-80">
          <circle
            cx="160"
            cy="160"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-white/5"
          />
          <motion.circle
            cx="160"
            cy="160"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            animate={{ strokeDashoffset }}
            initial={{ strokeDashoffset: circumference }}
            transition={{ duration: 1, ease: "linear" }}
            className="text-mint shadow-[0_0_15px_rgba(186,255,57,0.5)] drop-shadow-lg"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-7xl font-space font-bold tabular-nums tracking-tighter">
            {formatTime(timeLeft)}
          </span>
          <span className="text-white/40 font-medium mt-2 uppercase tracking-widest text-xs">
            {isActive ? 'Focusing...' : 'Ready to Flow'}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-6">
        <button
          onClick={toggleTimer}
          className="w-20 h-20 rounded-full bg-white text-charcoal flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl"
        >
          {isActive ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
        </button>
        <button
          onClick={resetTimer}
          className="w-14 h-14 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 active:scale-95 transition-all"
        >
          <RotateCcw className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
