
"use client";
import React from 'react'; // Added missing React import
import { useMemo } from 'react';
import type { Task } from '@/types';
import { useTasks } from '@/context/TasksContext';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DraggableProvided } from '@hello-pangea/dnd';


interface TaskItemProps {
  task: Task;
  provided: DraggableProvided; // Add this prop
}

const TaskItem: React.FC<TaskItemProps> = ({ task, provided }) => {
  const { toggleTask, deleteTask } = useTasks();

  const handleToggle = useMemo(() => () => toggleTask(task.id), [toggleTask, task.id]);
  const handleDelete = useMemo(() => () => deleteTask(task.id), [deleteTask, task.id]);

  return (
    <li
      ref={provided.innerRef} // Connect the ref
      {...provided.draggableProps} // Spread draggable props
      {...provided.dragHandleProps} // Spread drag handle props
      className={cn(
        'task-item flex items-center gap-3 p-3 bg-card border rounded-md mb-2 shadow-sm',
        task.completed && 'opacity-60'
      )}
      aria-label={`Task: ${task.text}, Status: ${task.completed ? 'Completed' : 'Pending'}`}
    >
      <Checkbox
        id={`task-${task.id}`}
        checked={task.completed}
        onCheckedChange={handleToggle}
        aria-labelledby={`task-label-${task.id}`}
        className={cn(task.completed && 'border-green-500 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-600')}
      />
      <label
        id={`task-label-${task.id}`}
        htmlFor={`task-${task.id}`}
        className={cn(
          'flex-grow cursor-pointer text-sm sm:text-base',
          task.completed && 'line-through text-muted-foreground'
        )}
      >
        {task.text}
      </label>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleDelete}
        aria-label={`Delete task: ${task.text}`}
        className="text-destructive hover:bg-destructive/10 h-8 w-8"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </li>
  );
};

// Use React.memo for performance optimization
// Compare only task and provided props
export default React.memo(TaskItem, (prevProps, nextProps) => {
    return prevProps.task === nextProps.task && prevProps.provided === nextProps.provided;
});

