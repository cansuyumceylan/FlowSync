"use client";

import { useState } from 'react';
import { useTaskStore } from '@/store/useTaskStore';
import { Plus, Trash2, Check, Circle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TaskList() {
  const [newTask, setNewTask] = useState('');
  const { tasks, addTask, removeTask, toggleTask } = useTaskStore();

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    addTask(newTask);
    setNewTask('');
  };

  return (
    <div className="glass-card p-6 h-full flex flex-col">
      <h3 className="font-space font-bold text-lg mb-4">Today's Focus</h3>
      
      <div className="flex-1 space-y-3 overflow-y-auto min-h-[200px] mb-4 pr-1 custom-scrollbar">
        <AnimatePresence>
          {tasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className={`p-3 rounded-xl border flex items-center justify-between group transition-all ${
                task.isCompleted 
                  ? 'bg-mint/5 border-mint/20 opacity-60' 
                  : 'bg-white/5 border-white/5 hover:bg-white/10'
              }`}
            >
              <div 
                onClick={() => toggleTask(task.id)}
                className="flex items-center gap-3 cursor-pointer flex-1"
              >
                {task.isCompleted ? (
                  <div className="w-5 h-5 rounded-full bg-mint flex items-center justify-center">
                    <Check className="w-3 h-3 text-charcoal" />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full border border-white/20" />
                )}
                <span className={`text-sm font-medium ${task.isCompleted ? 'line-through text-white/40' : 'text-white/80'}`}>
                  {task.title}
                </span>
              </div>
              
              <button
                onClick={() => removeTask(task.id)}
                className="text-white/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
          {tasks.length === 0 && (
            <div className="text-center py-8 text-white/40 text-sm">
              No tasks yet. Time to plan!
            </div>
          )}
        </AnimatePresence>
      </div>

      <form onSubmit={handleAdd} className="mt-auto">
        <div className="relative">
          <input
            type="text"
            placeholder="Add new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-mint/50 transition-colors"
          />
          <button
            type="submit"
            disabled={!newTask.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-mint disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110 transition-transform"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
