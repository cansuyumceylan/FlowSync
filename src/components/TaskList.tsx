"use client";

import { useTaskStore, Task } from '@/store/useTaskStore';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Trash2, Check, Circle, Flag, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

export default function TaskList() {
  const { tasks, addTask, removeTask, toggleTask, updateTask } = useTaskStore();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    addTask(newTaskTitle);
    setNewTaskTitle('');
  };

  const toggleExpand = (id: string) => {
    setExpandedTaskId(expandedTaskId === id ? null : id);
  };

  const priorityColors = {
    low: 'text-blue-400',
    medium: 'text-yellow-400',
    high: 'text-red-400',
  };

  return (
    <div className="glass-card p-6 h-full flex flex-col">
      <h2 className="text-xl font-space font-bold mb-4 flex items-center justify-between">
        Tasks
        <span className="text-xs font-normal text-white/40 bg-white/5 px-2 py-1 rounded-full">{tasks.filter(t => !t.isCompleted).length} active</span>
      </h2>

      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 -mr-2 pr-2">
        <AnimatePresence initial={false} mode="popLayout">
          {tasks.map((task) => (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`
                group rounded-xl border transition-all bg-white/5 border-white/10
                ${task.isCompleted ? 'opacity-50' : 'hover:bg-white/10'}
              `}
            >
              {/* Task Header */}
              <div className="flex items-center gap-3 p-3">
                <button
                  onClick={() => toggleTask(task.id)}
                  className="flex-shrink-0 text-mint transition-colors hover:scale-110 active:scale-90"
                >
                  {task.isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </button>
                
                <span className={`flex-1 text-sm font-medium truncate cursor-pointer ${task.isCompleted ? 'line-through text-white/40' : 'text-white/90'}`} onClick={() => toggleExpand(task.id)}>
                  {task.title}
                </span>

                <div className="flex items-center gap-1">
                   <button 
                     onClick={() => toggleExpand(task.id)}
                     className={`p-1.5 rounded-lg text-white/40 hover:bg-white/10 hover:text-white transition-all ${expandedTaskId === task.id ? 'bg-white/10 text-white' : ''}`}
                   >
                     {task.notes ? <FileText className="w-4 h-4 text-mint" /> : <ChevronDown className="w-4 h-4" />}
                   </button>
                    
                   <button
                    onClick={() => removeTask(task.id)}
                    className="p-1.5 opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Expanded Details */}
              <AnimatePresence>
                {expandedTaskId === task.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden border-t border-white/5"
                  >
                    <div className="p-4 space-y-4">
                        {/* Priority Selector */}
                        <div className="flex items-center gap-4">
                             <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Priority</label>
                             <div className="flex gap-1 bg-white/5 p-1 rounded-lg">
                               {(['low', 'medium', 'high'] as const).map((p) => (
                                   <button
                                     key={p}
                                     onClick={() => updateTask(task.id, { priority: p })}
                                     className={`px-3 py-1 rounded text-xs capitalize transition-all ${task.priority === p ? 'bg-white/10 text-white font-bold' : 'text-white/40 hover:text-white/60'}`}
                                   >
                                       {p}
                                   </button>
                               ))}
                             </div>
                        </div>

                        {/* Notes Area */}
                        <div>
                             <label className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2 block">Notes</label>
                             <textarea
                                value={task.notes || ''}
                                onChange={(e) => updateTask(task.id, { notes: e.target.value })}
                                placeholder="Add specific notes, sub-tasks, or links here..."
                                className="w-full bg-black/20 rounded-lg p-3 text-sm text-white/80 focus:outline-none focus:ring-1 focus:ring-mint/20 min-h-[80px] resize-y"
                             />
                        </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {tasks.length === 0 && (
          <div className="text-center py-10 opacity-30 text-sm">
            <p>No tasks yet.</p>
            <p>Add one below to start flowing.</p>
          </div>
        )}
      </div>

      <form onSubmit={handleAdd} className="mt-4 relative">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="New Task..."
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-mint/50 focus:bg-white/10 transition-all"
        />
        <button
          type="submit"
          disabled={!newTaskTitle.trim()}
          className="absolute right-2 top-2 p-1.5 bg-mint text-charcoal rounded-lg hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all"
        >
          <Plus className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
