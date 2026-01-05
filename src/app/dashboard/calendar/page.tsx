"use client";

import { useState } from 'react';
import { 
  DndContext, 
  DragOverlay, 
  useSensor, 
  useSensors, 
  PointerSensor, 
  DragStartEvent, 
  DragEndEvent 
} from '@dnd-kit/core';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  addMonths, 
  subMonths 
} from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { useTaskStore, Task } from '@/store/useTaskStore';
import DroppableDay from '@/components/Calendar/DroppableDay';
import DraggableTask from '@/components/Calendar/DraggableTask';
import UnscheduledArea from '@/components/Calendar/UnscheduledArea';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const { tasks, moveTask } = useTaskStore();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Calendar Logic
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday start
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
  
  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const handleDragStart = (event: DragStartEvent) => {
    setActiveTask(event.active.data.current?.task);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active) {
      const taskId = active.id as string;
      const targetDate = over.id as string;
      
      // If dropped on "unscheduled" (sidebar)
      if (targetDate === 'unscheduled') {
        moveTask(taskId, null);
      } else {
        // Dropped on a date
        moveTask(taskId, targetDate);
      }
    }
    
    setActiveTask(null);
  };

  // Filter Tasks
  const scheduledTasks = tasks.filter(t => t.scheduledDate);
  const unscheduledTasks = tasks.filter(t => !t.scheduledDate && !t.isCompleted);

  const getTasksForDate = (dateStr: string) => {
    return scheduledTasks.filter(t => t.scheduledDate === dateStr);
  };

  return (
    <DndContext 
      sensors={sensors} 
      onDragStart={handleDragStart} 
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col h-full gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-space font-bold">
              {format(currentDate, 'MMMM yyyy')}
            </h1>
            <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
              <button 
                onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                className="p-1 hover:bg-white/10 rounded-md transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                className="p-1 hover:bg-white/10 rounded-md transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-white/60">
            <CalendarIcon className="w-4 h-4" />
            <span>Plan your flow</span>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
          
          {/* Calendar Grid */}
          <div className="lg:col-span-3 glass-card flex flex-col overflow-hidden">
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 border-b border-white/10 bg-white/5">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <div key={day} className="p-3 text-center text-xs font-bold text-white/40 uppercase tracking-wider">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Days Grid */}
            <div className="grid grid-cols-7 flex-1 overflow-y-auto">
              {calendarDays.map((day, idx) => (
                <DroppableDay
                  key={day.toISOString()}
                  date={day}
                  currentMonth={currentDate}
                  tasks={getTasksForDate(format(day, 'yyyy-MM-dd'))}
                />
              ))}
            </div>
          </div>

          {/* Unscheduled Sidebar */}
          <UnscheduledArea tasks={unscheduledTasks} />
        </div>
      </div>

      <DragOverlay>
        {activeTask ? <DraggableTask task={activeTask} isOverlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}
