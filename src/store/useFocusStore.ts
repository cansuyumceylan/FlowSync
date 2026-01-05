import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type FocusMode = 'spark' | 'deepDive' | 'peakFlow' | 'custom';

interface FocusState {
  timeLeft: number;
  isActive: boolean;
  mode: FocusMode;
  totalDuration: number;
  activeTaskId: string | null;
  isSessionComplete: boolean; // Managed here
  setMode: (mode: FocusMode) => void;
  setActiveTask: (taskId: string | null) => void;
  setSessionComplete: (isComplete: boolean) => void;
  toggleTimer: () => void;
  resetTimer: () => void;
  tick: () => void;
}

const MODES = {
  spark: 25 * 60,
  deepDive: 50 * 60,
  peakFlow: 90 * 60,
  custom: 25 * 60,
};

export const useFocusStore = create<FocusState>()(
  persist(
    (set) => ({
      mode: 'spark',
      timeLeft: MODES.spark,
      totalDuration: MODES.spark,
      isActive: false,
      activeTaskId: null,
      isSessionComplete: false,

      setMode: (mode) => set({ 
        mode, 
        timeLeft: MODES[mode], 
        totalDuration: MODES[mode], 
        isActive: false 
      }),
      setActiveTask: (taskId) => set({ activeTaskId: taskId }),
      setSessionComplete: (isComplete) => set({ isSessionComplete: isComplete }),
      toggleTimer: () => set((state) => ({ isActive: !state.isActive })),
      resetTimer: () => set((state) => ({ 
        timeLeft: MODES[state.mode], 
        isActive: false 
      })),
      tick: () => set((state) => {
        if (state.timeLeft <= 0) {
          return { isActive: false, timeLeft: 0, isSessionComplete: true };
        }
        return { timeLeft: state.timeLeft - 1 };
      }),
    }),
    {
      name: 'flowsync-focus-storage',
    }
  )
);
