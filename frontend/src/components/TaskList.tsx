'use client';

import TaskItem from './TaskItem';
import { Task } from '@/lib/apiClient';

interface TaskListProps {
  tasks: Task[];
  onDeleteTask: (id: number) => Promise<void>;
  onUpdateTask: (id: number, updates: Partial<Task>) => Promise<Task>;
  onToggleTask: (id: number) => Promise<Task>;
  loading?: boolean;
}

export default function TaskList({
  tasks,
  onDeleteTask,
  onUpdateTask,
  onToggleTask,
  loading = false,
}: TaskListProps) {
  // Separate completed and pending tasks
  const pendingTasks = tasks.filter((task) => !task.status);
  const completedTasks = tasks.filter((task) => task.status);

  if (loading && tasks.length === 0) {
    return (
      <div className="px-6 py-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Pending Tasks Section */}
      {pendingTasks.length > 0 && (
        <div>
          <div className="px-6 py-3 bg-slate-50 border-b border-slate-200">
            <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
              Pending ({pendingTasks.length})
            </h2>
          </div>
          <div className="divide-y divide-slate-200">
            {pendingTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onDelete={onDeleteTask}
                onUpdate={onUpdateTask}
                onToggle={onToggleTask}
              />
            ))}
          </div>
        </div>
      )}

      {/* Completed Tasks Section */}
      {completedTasks.length > 0 && (
        <div>
          <div className="px-6 py-3 bg-slate-50 border-b border-slate-200">
            <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
              Completed ({completedTasks.length})
            </h2>
          </div>
          <div className="divide-y divide-slate-200">
            {completedTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onDelete={onDeleteTask}
                onUpdate={onUpdateTask}
                onToggle={onToggleTask}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}