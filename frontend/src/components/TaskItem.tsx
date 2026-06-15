'use client';

import { useState } from 'react';
import { Task } from '@/lib/apiClient';

interface TaskItemProps {
  task: Task;
  onDelete: (id: number) => Promise<void>;
  onUpdate: (id: number, updates: Partial<Task>) => Promise<Task>;
  onToggle: (id: number) => Promise<Task>;
}

export default function TaskItem({
  task,
  onDelete,
  onUpdate,
  onToggle,
}: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const handleSaveEdit = async () => {
    if (!editTitle.trim()) {
      alert('Task title cannot be empty');
      return;
    }

    try {
      await onUpdate(task.id, {
        title: editTitle.trim(),
        description: editDescription.trim(),
      });
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating task:', err);
      alert('Failed to update task');
    }
  };

  const handleCancelEdit = () => {
    setEditTitle(task.title);
    setEditDescription(task.description);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      setIsDeleting(true);
      await onDelete(task.id);
    } catch (err) {
      console.error('Error deleting task:', err);
      alert('Failed to delete task');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggle = async () => {
    try {
      setIsToggling(true);
      await onToggle(task.id);
    } catch (err) {
      console.error('Error toggling task:', err);
      alert('Failed to toggle task');
    } finally {
      setIsToggling(false);
    }
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isEditing) {
    return (
      <div className="px-6 py-4 bg-slate-50 hover:bg-slate-100 transition-colors">
        <div className="space-y-3">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 font-semibold"
            autoFocus
          />

          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-700 resize-none"
          />

          <div className="flex gap-2 pt-1">
            <button
              onClick={handleSaveEdit}
              className="px-3 py-1 bg-emerald-600 text-white text-sm font-medium rounded hover:bg-emerald-700 transition-colors disabled:opacity-50"
              disabled={!editTitle.trim()}
            >
              Save
            </button>
            <button
              onClick={handleCancelEdit}
              className="px-3 py-1 bg-slate-300 text-slate-700 text-sm font-medium rounded hover:bg-slate-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`px-6 py-4 hover:bg-slate-50 transition-colors ${
        task.status ? 'bg-emerald-50' : ''
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <button
          onClick={handleToggle}
          disabled={isToggling}
          className={`flex-shrink-0 mt-1 w-6 h-6 rounded border-2 transition-all flex items-center justify-center disabled:opacity-50 ${
            task.status
              ? 'bg-emerald-600 border-emerald-600'
              : 'border-slate-300 hover:border-slate-400'
          }`}
          aria-label={task.status ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {task.status && (
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </button>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <h3
            className={`text-base font-semibold break-words ${
              task.status
                ? 'text-slate-500 line-through'
                : 'text-slate-900'
            }`}
          >
            {task.title}
          </h3>

          {task.description && (
            <p
              className={`text-sm mt-1 break-words ${
                task.status
                  ? 'text-slate-400 line-through'
                  : 'text-slate-600'
              }`}
            >
              {task.description}
            </p>
          )}

          <div className="text-xs text-slate-400 mt-2">
            {formatDate(task.created_at)}
          </div>
        </div>

        {/* Actions */}
        <div className="flex-shrink-0 flex gap-2">
          <button
            onClick={() => setIsEditing(true)}
            disabled={isDeleting}
            className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
            aria-label="Edit task"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
            aria-label="Delete task"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}