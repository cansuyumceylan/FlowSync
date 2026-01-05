"use client";

import { useDroppable } from '@dnd-kit/core';
import { Task } from '@/store/useTaskStore';
import DraggableTask from './DraggableTask';
import { List as ListIcon } from 'lucide-react';

interface UnscheduledAreaProps {
  tasks: Task[];
}

export default function UnscheduledArea({ tasks }: UnscheduledAreaProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'unscheduled',
  });

  return (
    <div 
      ref={setNodeRef}
      className={`
        glass-card flex flex-col overflow-hidden p-4 transition-colors
        ${isOver ? 'bg-mint/5 ring-2 ring-inset ring-mint/20' : 'bg-white/5'}
      `}
    >
      <div className="flex items-center gap-2 mb-4 text-mint">
        <ListIcon className="w-5 h-5" />
        <h2 className="font-bold">Unscheduled</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar min-h-[200px]">
          {tasks.map(task => (
            <DraggableTask key={task.id} task={task} />
          ))}
          
          {tasks.length === 0 && (
            <div className="text-center text-white/30 text-xs py-10 border-2 border-dashed border-white/10 rounded-xl">
              All tasks scheduled! <br/> Great job.
            </div>
          )}
      </div>
    </div>
  );
}
