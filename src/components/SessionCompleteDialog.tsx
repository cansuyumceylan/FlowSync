"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, CalendarClock, ListRestart, X, MessageSquare, Sparkles, ArrowRight } from 'lucide-react';
import { useTaskStore } from '@/store/useTaskStore';
import { useFocusStore } from '@/store/useFocusStore';
import { useActivityStore } from '@/store/useActivityStore';
import { useScheduleStore, DayOfWeek } from '@/store/useScheduleStore';
import { addDays, format } from 'date-fns';
import { useState } from 'react';

export default function SessionCompleteDialog() {
  const { isSessionComplete, activeTaskId, setSessionComplete, resetTimer, setActiveTask, mode } = useFocusStore();
  const { toggleTask, moveTask, tasks } = useTaskStore();
  const { addLog } = useActivityStore();
  const { getBlocksForDay } = useScheduleStore();
  
  const [sessionNote, setSessionNote] = useState('');
  const [suggestion, setSuggestion] = useState<{ date: string, time: string, reason: string } | null>(null);

  const activeTask = tasks.find(t => t.id === activeTaskId);

  if (!isSessionComplete) return null;

  const saveAnalytics = () => {
      addLog({
          taskId: activeTaskId,
          taskTitle: activeTask?.title || null,
          mode: mode,
          duration: mode === 'spark' ? 25 : mode === 'deepDive' ? 50 : 90,
          notes: sessionNote.trim() || undefined
      });
  };

  const handleComplete = () => {
    saveAnalytics();
    if (activeTaskId) {
      toggleTask(activeTaskId); 
    }
    closeDialog();
  };

  const findSmartSlot = () => {
      if (!activeTaskId) return;

      const tomorrow = addDays(new Date(), 1);
      const dayName = format(tomorrow, 'eeee') as DayOfWeek;
      const dateStr = format(tomorrow, 'yyyy-MM-dd');
      
      const blocks = getBlocksForDay(dayName);
      const workBlocks = blocks.filter(b => b.type === 'work');

      // Simple logic: Find first available work block
      // In a real app, we would check for conflicts with other tasks
      if (workBlocks.length > 0) {
          const firstBlock = workBlocks[0];
          setSuggestion({
              date: dateStr,
              time: firstBlock.startTime,
              reason: `Found a free ${firstBlock.label} slot tomorrow.`
          });
      } else {
          setSuggestion({
              date: dateStr,
              time: '09:00', // Default fallback
              reason: 'No work blocks found, suggesting morning start.'
          });
      }
  };

  const handleSmartReschedule = () => {
      if (!suggestion || !activeTaskId) return;
      
      saveAnalytics();
      moveTask(activeTaskId, suggestion.date, suggestion.time);
      closeDialog();
  };

  const handleStandardReschedule = () => {
      saveAnalytics();
      if (activeTaskId) {
          const tomorrow = format(addDays(new Date(), 1), 'yyyy-MM-dd');
          moveTask(activeTaskId, tomorrow);
      }
      closeDialog();
  }

  const handleUnschedule = () => {
    saveAnalytics();
    if (activeTaskId) {
      moveTask(activeTaskId, null);
    }
    closeDialog();
  };

  const handleJustClose = () => {
      saveAnalytics();
      closeDialog();
  }

  const closeDialog = () => {
    setSessionComplete(false); 
    resetTimer(); 
    setActiveTask(null); 
    setSessionNote(''); 
    setSuggestion(null);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-charcoal border border-mint/20 p-8 rounded-2xl shadow-2xl max-w-md w-full relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5">
             <CheckCircle className="w-32 h-32 text-mint" />
          </div>

          <h2 className="text-2xl font-space font-bold mb-2 text-white">Session Complete! 🎉</h2>
          <p className="text-white/60 mb-6">
            Great session. 
            {activeTask ? (
              <span> Plan next steps for <span className="text-mint font-medium">"{activeTask.title}"</span>?</span>
            ) : (
              <span> You stayed in the flow.</span>
            )}
          </p>

          {!suggestion && (
            <div className="mb-6">
                <label className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2 block">
                    <MessageSquare className="w-3 h-3 inline mr-1" />
                    Session Notes
                </label>
                <textarea
                    value={sessionNote}
                    onChange={(e) => setSessionNote(e.target.value)}
                    placeholder="Short summary..."
                    className="w-full bg-black/20 rounded-lg p-3 text-sm text-white/80 focus:outline-none focus:ring-1 focus:ring-mint/20 h-20 resize-none"
                />
            </div>
          )}

          <div className="space-y-3">
             {activeTask && !suggestion && (
               <>
                <button onClick={handleComplete} className="w-full flex items-center justify-between p-4 bg-mint text-charcoal rounded-xl font-bold hover:brightness-110 transition-all group">
                  <span className="flex items-center gap-3"><CheckCircle className="w-5 h-5" /> Task Completed</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </button>

                <button onClick={findSmartSlot} className="w-full flex items-center justify-between p-4 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-xl font-bold hover:bg-purple-500/30 transition-all">
                    <span className="flex items-center gap-3"><Sparkles className="w-5 h-5" /> Smart Reschedule</span>
                    <ArrowRight className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button onClick={handleStandardReschedule} className="flex flex-col items-center justify-center p-3 bg-white/5 hover:bg-white/10 rounded-xl gap-1 text-xs font-medium text-white/60">
                    <CalendarClock className="w-4 h-4" /> Tomorrow
                  </button>
                  <button onClick={handleUnschedule} className="flex flex-col items-center justify-center p-3 bg-white/5 hover:bg-white/10 rounded-xl gap-1 text-xs font-medium text-white/60">
                    <ListRestart className="w-4 h-4" /> Unschedule
                  </button>
                </div>
               </>
             )}

             {suggestion && (
                 <div className="bg-purple-500/10 border border-purple-500/30 p-4 rounded-xl space-y-3">
                     <div className="flex items-start gap-3">
                         <Sparkles className="w-5 h-5 text-purple-400 mt-1" />
                         <div>
                             <h4 className="font-bold text-purple-200">AI Suggestion</h4>
                             <p className="text-sm text-purple-300/80">{suggestion.reason}</p>
                             <div className="mt-2 text-lg font-space font-bold text-white">
                                 {suggestion.time} <span className="text-sm font-normal opacity-60">Tomorrow</span>
                             </div>
                         </div>
                     </div>
                     <div className="flex gap-2">
                         <button onClick={handleSmartReschedule} className="flex-1 py-2 bg-purple-500 text-white rounded-lg font-bold text-sm">Accept</button>
                         <button onClick={() => setSuggestion(null)} className="px-4 py-2 bg-white/5 text-white/60 hover:text-white rounded-lg text-sm">Cancel</button>
                     </div>
                 </div>
             )}

             {!activeTask && (
                <button onClick={handleJustClose} className="w-full p-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold">
                  Close & Take a Break
                </button>
             )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
