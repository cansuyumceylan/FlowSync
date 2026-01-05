"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, CalendarClock, ListRestart, X } from 'lucide-react';
import { useTaskStore } from '@/store/useTaskStore';
import { useFocusStore } from '@/store/useFocusStore';
import { addDays, format } from 'date-fns';

export default function SessionCompleteDialog() {
  const { isSessionComplete, activeTaskId, setSessionComplete, resetTimer, setActiveTask } = useFocusStore();
  const { toggleTask, moveTask, tasks } = useTaskStore();

  const activeTask = tasks.find(t => t.id === activeTaskId);

  if (!isSessionComplete) return null;

  const handleComplete = () => {
    if (activeTaskId) {
      toggleTask(activeTaskId); // Mark as complete
    }
    closeDialog();
  };

  const handleReschedule = () => {
    if (activeTaskId) {
      const tomorrow = format(addDays(new Date(), 1), 'yyyy-MM-dd');
      moveTask(activeTaskId, tomorrow);
    }
    closeDialog();
  };

  const handleUnschedule = () => {
    if (activeTaskId) {
      moveTask(activeTaskId, null);
    }
    closeDialog();
  };

  const closeDialog = () => {
    setSessionComplete(false); // Hide dialog
    resetTimer(); // Reset timer UI
    setActiveTask(null); // Clear active task
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
          {/* Background decoration */}
          <div className="absolute top-0 right-0 p-8 opacity-5">
             <CheckCircle className="w-32 h-32 text-mint" />
          </div>

          <h2 className="text-2xl font-space font-bold mb-2 text-white">Session Complete! 🎉</h2>
          <p className="text-white/60 mb-8">
            Great focus session. 
            {activeTask ? (
              <span> How did it go with <span className="text-mint font-medium">"{activeTask.title}"</span>?</span>
            ) : (
              <span> You stayed in the flow.</span>
            )}
          </p>

          <div className="space-y-3">
             {activeTask && (
               <>
                <button 
                  onClick={handleComplete}
                  className="w-full flex items-center justify-between p-4 bg-mint text-charcoal rounded-xl font-bold hover:brightness-110 transition-all group"
                >
                  <span className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5" />
                    Task Completed
                  </span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={handleReschedule}
                    className="flex flex-col items-center justify-center p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors gap-2 text-sm font-medium text-white/80"
                  >
                    <CalendarClock className="w-5 h-5 text-blue-400" />
                    Reschedule Tomorrow
                  </button>

                  <button 
                     onClick={handleUnschedule}
                     className="flex flex-col items-center justify-center p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors gap-2 text-sm font-medium text-white/80"
                  >
                    <ListRestart className="w-5 h-5 text-orange-400" />
                    Back to List
                  </button>
                </div>
               </>
             )}

             {!activeTask && (
                <button 
                  onClick={closeDialog}
                  className="w-full p-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-all"
                >
                  Close & Take a Break
                </button>
             )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
