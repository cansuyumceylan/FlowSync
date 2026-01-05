"use client";

import { useDroppable } from '@dnd-kit/core';
import { format, isToday, isSameMonth } from 'date-fns';
import { Task } from '@/store/useTaskStore';
import DraggableTask from './DraggableTask';

interface DroppableDayProps {
  date: Date;
  currentMonth: Date;
  tasks: Task[];
}

export default function DroppableDay({ date, currentMonth, tasks }: DroppableDayProps) {
  const dateStr = format(date, 'yyyy-MM-dd');
  const { setNodeRef, isOver } = useDroppable({
    id: dateStr,
    data: { date: dateStr },
  });

  const isCurrentMonth = isSameMonth(date, currentMonth);
  const isDayToday = isToday(date);

  return (
    <div
      ref={setNodeRef}
      className={`
        min-h-[120px] p-2 border-r border-b border-white/5 transition-colors relative
        ${!isCurrentMonth ? 'bg-white/[0.02] opacity-50' : ''}
        ${isOver ? 'bg-mint/5 ring-inset ring-2 ring-mint/20' : ''}
      `}
    >
      <div className="flex items-center justify-between mb-2">
        <span 
          className={`
            text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full
            ${isDayToday ? 'bg-mint text-charcoal font-bold shadow-lg shadow-mint/20' : 'text-white/60'}
          `}
        >
          {format(date, 'd')}
        </span>
      </div>

      <div className="space-y-2">
        {tasks.map((task) => (
          <DraggableTask key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
