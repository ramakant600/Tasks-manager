"use client";

import type React from 'react';
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import useLocalStorage from '@/hooks/use-local-storage';
import type { Task, Filter } from '@/types';
import { v4 as uuidv4 } from 'uuid';

interface TasksContextProps {
  tasks: Task[];
  filter: Filter;
  filteredTasks: Task[];
  addTask: (text: string) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  setFilter: (filter: Filter) => void;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>; // For drag and drop
}

const TasksContext = createContext<TasksContextProps | undefined>(undefined);

export const TasksProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
  const [filter, setFilter] = useState<Filter>('all');

  const addTask = useCallback(
    (text: string) => {
      if (!text.trim()) return; // Prevent adding empty tasks
      const newTask: Task = {
        id: uuidv4(),
        text: text.trim(),
        completed: false,
      };
      setTasks((prevTasks) => [...prevTasks, newTask]);
    },
    [setTasks]
  );

  const toggleTask = useCallback(
    (id: string) => {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id ? { ...task, completed: !task.completed } : task
        )
      );
    },
    [setTasks]
  );

  const deleteTask = useCallback(
    (id: string) => {
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    },
    [setTasks]
  );

  const filteredTasks = useMemo(() => {
    switch (filter) {
      case 'completed':
        return tasks.filter((task) => task.completed);
      case 'pending':
        return tasks.filter((task) => !task.completed);
      default:
        return tasks;
    }
  }, [tasks, filter]);

  const contextValue = useMemo(
    () => ({
      tasks,
      filter,
      filteredTasks,
      addTask,
      toggleTask,
      deleteTask,
      setFilter,
      setTasks, // Expose setTasks for drag and drop reordering
    }),
    [tasks, filter, filteredTasks, addTask, toggleTask, deleteTask, setTasks]
  );

  return (
    <TasksContext.Provider value={contextValue}>
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = (): TasksContextProps => {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error('useTasks must be used within a TasksProvider');
  }
  return context;
};
