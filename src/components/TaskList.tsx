"use client";

import React, { useState, useEffect } from 'react';
import { useTasks } from '@/context/TasksContext';
import TaskItem from '@/components/TaskItem';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton

const TaskList: React.FC = () => {
  const { filteredTasks, setTasks, filter } = useTasks(); // Add filter dependency
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);


  const onDragEnd = (result: DropResult) => {
    if (!result.destination || !isClient) {
      return;
    }

     // Get the full list of tasks directly from context
     const currentFullTasks = [...useTasks().tasks]; // Get the latest full list
     const reorderedFilteredTasks = Array.from(filteredTasks); // Current filtered list
     const [movedItem] = reorderedFilteredTasks.splice(result.source.index, 1); // Remove from old position
     reorderedFilteredTasks.splice(result.destination.index, 0, movedItem); // Insert into new position


     // Map the new order of filtered task IDs
     const newFilteredOrderMap = new Map(reorderedFilteredTasks.map((task, index) => [task.id, index]));

     // Sort the full task list based on the new filtered order
     // Tasks not in the current filter maintain their relative order amongst themselves
     // and are placed after the filtered tasks.
     const updatedFullTasks = currentFullTasks.sort((a, b) => {
        const indexA = newFilteredOrderMap.get(a.id);
        const indexB = newFilteredOrderMap.get(b.id);

        // Both tasks are in the filtered & reordered list
        if (indexA !== undefined && indexB !== undefined) {
            return indexA - indexB;
        }
        // Task A is filtered, Task B is not
        if (indexA !== undefined) {
            return -1; // Place filtered tasks first
        }
        // Task B is filtered, Task A is not
        if (indexB !== undefined) {
            return 1; // Place filtered tasks first
        }
        // Neither task is in the current filter, maintain original relative order
        // Find original indices to maintain relative order of non-filtered items
        const originalIndexA = currentFullTasks.findIndex(task => task.id === a.id);
        const originalIndexB = currentFullTasks.findIndex(task => task.id === b.id);
        return originalIndexA - originalIndexB;
     });


     setTasks(updatedFullTasks); // Update the full list state
  };

   // Render placeholder or skeleton when not on client or tasks loading
   if (!isClient) {
     // Render a few skeletons as placeholders
     return (
       <div className="space-y-2 list-none p-0 m-0">
         {[...Array(3)].map((_, i) => (
            <li key={i} className="flex items-center gap-3 p-3 bg-card border rounded-md mb-2 shadow-sm opacity-50">
                 <Skeleton className="h-5 w-5 rounded" />
                 <Skeleton className="h-4 flex-grow" />
                 <Skeleton className="h-8 w-8 rounded" />
            </li>
         ))}
       </div>
     );
   }


  if (filteredTasks.length === 0 && isClient) {
    let message = "No tasks here yet!";
    if (filter === 'completed') message = "No completed tasks.";
    else if (filter === 'pending') message = "No pending tasks.";
    return <p className="text-center text-muted-foreground py-8">{message}</p>;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="taskList">
        {(provided) => (
          <ul
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="list-none p-0 m-0" // Removed space-y-2, TaskItem handles margin
            aria-label="Task list"
          >
            {filteredTasks.map((task, index) => (
               // Ensure Draggable is only rendered on the client
               <Draggable key={task.id} draggableId={task.id} index={index}>
                 {(provided) => (
                   <TaskItem task={task} provided={provided} />
                 )}
               </Draggable>
            ))}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default TaskList;
