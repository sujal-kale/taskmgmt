'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiClient, Task, TaskInput, APIError } from '@/lib/apiClient';

export interface UseTasksReturn {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  addTask: (data: TaskInput) => Promise<Task>;
  updateTask: (id: number, data: Partial<TaskInput>) => Promise<Task>;
  deleteTask: (id: number) => Promise<void>;
  toggleTask: (id: number) => Promise<Task>;
  refreshTasks: () => Promise<void>;
}

export function useTasks(enabled: boolean = true): UseTasksReturn {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.getAllTasks();
      setTasks(data.tasks);
    } catch (err) {
      const message =
        err instanceof APIError ? err.message : 'Failed to fetch tasks';
      setError(message);
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = useCallback(async (data: TaskInput): Promise<Task> => {
    try {
      console.log('🔄 useTasks.addTask called with:', data);
      setError(null);
      const newTask = await apiClient.createTask(data);
      console.log('✅ Task created, updating state with:', newTask);
      setTasks((prev) => {
        const updated = [newTask, ...prev];
        console.log('📊 Updated tasks state:', updated);
        return updated;
      });
      return newTask;
    } catch (err) {
      const message =
        err instanceof APIError ? err.message : 'Failed to create task';
      console.error('❌ Error in addTask:', message, err);
      setError(message);
      throw err;
    }
  }, []);

  const updateTask = useCallback(
    async (id: number, data: Partial<TaskInput>): Promise<Task> => {
      try {
        setError(null);
        const updated = await apiClient.updateTask(id, data);
        setTasks((prev) =>
          prev.map((task) => (task.id === id ? updated : task))
        );
        return updated;
      } catch (err) {
        const message =
          err instanceof APIError ? err.message : 'Failed to update task';
        setError(message);
        throw err;
      }
    },
    []
  );

  const deleteTask = useCallback(async (id: number): Promise<void> => {
    try {
      setError(null);
      await apiClient.deleteTask(id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (err) {
      const message =
        err instanceof APIError ? err.message : 'Failed to delete task';
      setError(message);
      throw err;
    }
  }, []);

  const toggleTask = useCallback(async (id: number): Promise<Task> => {
    try {
      setError(null);
      const updated = await apiClient.toggleTask(id);
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? updated : task))
      );
      return updated;
    } catch (err) {
      const message =
        err instanceof APIError ? err.message : 'Failed to toggle task';
      setError(message);
      throw err;
    }
  }, []);

  return {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    refreshTasks: fetchTasks,
  };
}