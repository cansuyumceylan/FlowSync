import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
export type BlockType = 'work' | 'hobby' | 'rest' | 'other';

export interface TimeBlock {
    id: string;
    day: DayOfWeek;
    startTime: string; // "HH:mm"
    endTime: string; // "HH:mm"
    type: BlockType;
    label: string;
}

interface ScheduleState {
    blocks: TimeBlock[];
    addBlock: (block: Omit<TimeBlock, 'id'>) => void;
    removeBlock: (id: string) => void;
    updateBlock: (id: string, updates: Partial<TimeBlock>) => void;
    getBlocksForDay: (day: DayOfWeek) => TimeBlock[];
}

export const useScheduleStore = create<ScheduleState>()(
    persist(
        (set, get) => ({
            blocks: [
                // Default Schedule Suggestion
                { id: '1', day: 'Monday', startTime: '09:00', endTime: '12:00', type: 'work', label: 'Deep Work' },
                { id: '2', day: 'Monday', startTime: '13:00', endTime: '17:00', type: 'work', label: 'Work' },
                { id: '3', day: 'Monday', startTime: '19:00', endTime: '21:00', type: 'hobby', label: 'Reading' },
            ],
            addBlock: (block) => set((state) => ({
                blocks: [...state.blocks, { id: crypto.randomUUID(), ...block }]
            })),
            removeBlock: (id) => set((state) => ({
                blocks: state.blocks.filter(b => b.id !== id)
            })),
            updateBlock: (id, updates) => set((state) => ({
                blocks: state.blocks.map(b => b.id === id ? { ...b, ...updates } : b)
            })),
            getBlocksForDay: (day) => get().blocks.filter(b => b.day === day).sort((a, b) => a.startTime.localeCompare(b.startTime))
        }),
        {
            name: 'flowsync-schedule-storage',
        }
    )
);
