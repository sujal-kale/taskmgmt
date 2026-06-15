'use client';
import { useState } from 'react';

interface TaskInputProps {
  onAddTask: (taskData: { title: string; description: string }) => void;
}

export default function TaskInput({ onAddTask }: TaskInputProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!title.trim()) {
      alert('Please enter a task title');
      return;
    }

    // Call parent function
    onAddTask({
      title: title.trim(),
      description: description.trim(),
    });

    // Reset form
    setTitle('');
    setDescription('');
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full px-6 py-4 md:py-5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 text-base md:text-lg transform hover:scale-105"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
        Add a new task
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="card p-6 md:p-8 animate-fadeIn"
    >
      <div className="space-y-5 md:space-y-6">
        {/* Title Input */}
        <div>
          <label htmlFor="title" className="block text-base md:text-lg font-bold text-slate-900 mb-3">
            Task Title
          </label>
          <input
            id="title"
            type="text"
            placeholder="e.g., Fix login bug, Design homepage..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-field"
            autoFocus
          />
        </div>

        {/* Description Input */}
        <div>
          <label htmlFor="description" className="block text-base md:text-lg font-bold text-slate-900 mb-3">
            Task Description
            <span className="text-slate-500 font-normal ml-2 text-sm">(optional)</span>
          </label>
          <textarea
            id="description"
            placeholder="Add more details about this task... What needs to be done? Why is it important?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="input-field resize-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="flex-1 btn-primary text-base md:text-lg py-3 md:py-3.5"
          >
            ✓ Create Task
          </button>
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              setTitle('');
              setDescription('');
            }}
            className="flex-1 btn-secondary text-base md:text-lg py-3 md:py-3.5"
          >
            ✕ Cancel
          </button>
        </div>
      </div>
    </form>
  );
}
