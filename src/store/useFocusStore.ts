import { create } from 'zustand';

export type FocusMode = 'spark' | 'deepDive' | 'peakFlow' | 'custom';

interface FocusState {
  timeLeft: number;
  isActive: boolean;
  mode: FocusMode;
  totalDuration: number;
  setMode: (mode: FocusMode) => void;
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

export const useFocusStore = create<FocusState>((set) => ({
  mode: 'spark',
  timeLeft: MODES.spark,
  totalDuration: MODES.spark,
  isActive: false,
  setMode: (mode) => set({ 
    mode, 
    timeLeft: MODES[mode], 
    totalDuration: MODES[mode], 
    isActive: false 
  }),
  toggleTimer: () => set((state) => ({ isActive: !state.isActive })),
  resetTimer: () => set((state) => ({ 
    timeLeft: MODES[state.mode], 
    isActive: false 
  })),
  tick: () => set((state) => {
    if (state.timeLeft <= 0) {
      return { isActive: false, timeLeft: 0 };
    }
    return { timeLeft: state.timeLeft - 1 };
  }),
}));
