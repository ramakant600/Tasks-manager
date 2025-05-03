
"use client";

import React, { useState, useCallback } from 'react'; // Added React import
import { useTasks } from '@/context/TasksContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const TaskInput: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const { addTask } = useTasks();

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (inputValue.trim()) {
        addTask(inputValue);
        setInputValue('');
      }
    },
    [addTask, inputValue]
  );

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  }, []);

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <Input
        type="text"
        placeholder="Add a new task..."
        value={inputValue}
        onChange={handleChange}
        aria-label="New task input"
        className="flex-grow"
      />
      <Button type="submit" aria-label="Add task" disabled={!inputValue.trim()}>
        <Plus className="h-4 w-4" />
        <span className="sr-only sm:not-sr-only sm:ml-2">Add</span>
      </Button>
    </form>
  );
};

export default React.memo(TaskInput);

