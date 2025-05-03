
"use client";
import React from 'react'; // Added React import
import { useCallback } from 'react';
import { useTasks } from '@/context/TasksContext';
import { Button } from '@/components/ui/button';
import type { Filter } from '@/types';

const filters: { label: string; value: Filter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Completed', value: 'completed' },
];

const TaskFilter: React.FC = () => {
  const { filter, setFilter } = useTasks();

  const handleFilterChange = useCallback(
    (newFilter: Filter) => {
      setFilter(newFilter);
    },
    [setFilter]
  );

  return (
    <div className="flex justify-center gap-2 mb-6" role="group" aria-label="Task filters">
      {filters.map((f) => (
        <Button
          key={f.value}
          variant={filter === f.value ? 'default' : 'outline'}
          onClick={() => handleFilterChange(f.value)}
          aria-pressed={filter === f.value}
          className="capitalize"
        >
          {f.label}
        </Button>
      ))}
    </div>
  );
};

export default React.memo(TaskFilter);
