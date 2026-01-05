"use client";

import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '@/store/useTaskStore';
import { useFocusStore } from '@/store/useFocusStore';
import { GripVertical, Clock, Play } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface DraggableTaskProps {
  task: Task;
  isOverlay?: boolean;
}

export default function DraggableTask({ task, isOverlay }: DraggableTaskProps) {
  const router = useRouter();
  const setActiveTask = useFocusStore((state) => state.setActiveTask);
  
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: { task },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  const handleStartFocus = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent drag start when clicking button
    setActiveTask(task.id);
    router.push('/dashboard');
  };

  if (isDragging && !isOverlay) {
    return (
      <div 
        ref={setNodeRef} 
        style={style} 
        className="opacity-50 bg-mint/10 border border-mint/20 p-2 rounded-lg h-[60px]" 
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        group relative p-3 rounded-lg border transition-all cursor-grab active:cursor-grabbing flex flex-col justify-between
        ${isOverlay 
          ? 'bg-charcoal/90 border-mint shadow-xl shadow-mint/20 rotate-2 scale-105 z-50' 
          : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
        }
      `}
    >
      <div className="flex items-center gap-2 flex-1 min-w-0 mb-2">
        <GripVertical className="w-4 h-4 text-white/20 group-hover:text-white/40 flex-shrink-0" />
        <span className="text-sm font-medium text-white/90 truncate">{task.title}</span>
      </div>
      
      <div className="flex items-center justify-between pl-6 text-xs text-white/40">
        <div className="flex items-center gap-1">
          {task.duration && (
            <>
              <Clock className="w-3 h-3" />
              <span>{task.duration}m</span>
            </>
          )}
        </div>
        
        {!isOverlay && (
          <button 
            onPointerDown={(e) => e.stopPropagation()} // Important for DnD to not hijack click
            onClick={handleStartFocus}
            className="p-1.5 rounded-full hover:bg-mint hover:text-charcoal text-white/20 transition-colors"
            title="Start Focus Session"
          >
            <Play className="w-3 h-3 fill-current" />
          </button>
        )}
      </div>
    </div>
  );
}
