# Task Management System

A clean, well-architected Task Management System built with **Next.js 14 (App Router)** and **Tailwind CSS**.

## ✨ Features

- ✅ **Create** new tasks with title and description
- ✅ **Read** all tasks in an organized list
- ✅ **Update** existing task details inline
- ✅ **Delete** tasks with a single click
- ✅ **Toggle** task completion status
- ✅ **Persistent Storage** with localStorage
- ✅ **Live Stats** showing total, pending, and completed tasks
- ✅ **Responsive Design** for mobile and desktop
- ✅ **Clean UI** with visual distinction between task statuses
- ✅ **Empty State** messaging when no tasks exist

## 🏗️ Architecture Overview

This project follows a strict **component-based architecture** with clear separation of concerns:

### Data Flow

```
┌─────────────────────────────────────────────────────┐
│  TaskManagement (Parent Component)                   │
│  - State: tasks[] (useReducer)                       │
│  - Functions: addTask, deleteTask, updateTask, etc.  │
└────────────────────────────────────────────────────┬─┘
         │                               │
         │ passes addTask               │ passes all actions
         │                               │
    ┌────▼──────┐                 ┌─────▼──────┐
    │ TaskInput │                 │ TaskList   │
    │ - local   │                 │ - maps     │
    │   state   │                 │   tasks    │
    └────┬──────┘                 └─────┬──────┘
         │                               │
         │ emits new task                │ renders
         │                               │
         │                         ┌─────▼──────┐
         │                         │ TaskItem   │
         │                         │ - toggle   │
         │                         │ - edit     │
         │                         │ - delete   │
         │                         └────────────┘
         │
    (callbacks bubble up to parent)
```

### State Management

The app uses **useReducer** for predictable state updates:

- **ADD_TASK**: Creates a new task with unique ID and timestamp
- **DELETE_TASK**: Removes task by ID
- **UPDATE_TASK**: Updates task properties (title, description)
- **TOGGLE_TASK**: Flips completion status
- **LOAD_TASKS**: Hydrates state from localStorage

### localStorage Integration

- Tasks are automatically persisted to localStorage on every change
- Tasks are restored on app load (only if mounted to prevent hydration mismatch)
- All data is stored as JSON

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Main page (TaskManagement component)
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles with Tailwind directives
├── components/
│   ├── TaskInput.tsx         # Input form component
│   ├── TaskList.tsx          # List container with grouping
│   └── TaskItem.tsx          # Individual task component
├── next.config.js            # Next.js configuration
├── tsconfig.json             # TypeScript config
├── tailwind.config.ts        # Tailwind CSS config
├── postcss.config.js         # PostCSS config
└── package.json              # Dependencies

Configuration files:
- .env.local                  # Environment variables (if needed)
- .gitignore                  # Git ignore patterns
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (for native `crypto.randomUUID()`)
- npm, yarn, or pnpm

### Installation

1. **Clone or download** this project

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```

4. **Open browser**:
   - Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
npm start
```

## 🧩 Component Details

### TaskManagement (page.tsx)

**Responsibilities:**
- Manage task state with useReducer
- Persist and restore from localStorage
- Provide task action functions
- Render input, list, and statistics

**Props:** None (root component)

**State:**
```typescript
interface Task {
  id: string;              // UUID
  title: string;           // Task name
  description: string;     // Optional details
  status: boolean;         // true = completed, false = pending
  createdAt: number;       // Timestamp in milliseconds
}
```

**Key Functions:**
- `addTask(taskData)` - Adds new task, generates ID and timestamp
- `deleteTask(id)` - Removes task
- `updateTask(id, updates)` - Merges updates into task
- `toggleTask(id)` - Flips completion status

---

### TaskInput Component

**Responsibilities:**
- Collect user input for task title and description
- Maintain local input state only
- Validate before submission
- Reset form after successful submission

**Props:**
```typescript
interface TaskInputProps {
  onAddTask: (taskData: { title: string; description: string }) => void;
}
```

**Internal State:**
- `title: string` - Current title input
- `description: string` - Current description input
- `isOpen: boolean` - Toggle between collapsed/expanded UI

**Notes:**
- Does NOT contain task creation logic
- Only collects and validates input
- Emits clean data (no ID, status, or timestamp)
- Includes form validation

---

### TaskList Component

**Responsibilities:**
- Group tasks into "Pending" and "Completed" sections
- Map over task array
- Render TaskItem for each task

**Props:**
```typescript
interface TaskListProps {
  tasks: Task[];
  onDeleteTask: (id: string) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onToggleTask: (id: string) => void;
}
```

**Features:**
- Renders section headers with counts
- Only shows sections with tasks
- Clean visual separation between statuses

**Notes:**
- Pure presentation component
- No state management
- Passes all actions directly to TaskItem

---

### TaskItem Component

**Responsibilities:**
- Display single task (title, description, status, date)
- Handle inline editing
- Provide action buttons (edit, delete, toggle)
- Visual feedback for completed tasks

**Props:**
```typescript
interface TaskItemProps {
  task: Task;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onToggle: (id: string) => void;
}
```

**Internal State:**
- `isEditing: boolean` - Toggle edit mode
- `editTitle: string` - Temp edit value
- `editDescription: string` - Temp edit value

**Features:**
- Click checkbox to toggle completion
- Click edit icon to enter edit mode
- Click delete icon to remove task
- Inline validation during edit
- Cancel to discard changes
- Visual strikethrough for completed tasks

**Notes:**
- Contains UI logic only (edit mode, validation)
- Does NOT contain business logic
- All mutations delegate to parent

---

## 🎨 Design System

### Color Palette

- **Primary**: Blue-600 (actions) → Blue-700 (hover)
- **Success**: Emerald-600 (completed states)
- **Accent**: Amber-600 (pending indicators)
- **Neutral**: Slate-50 to Slate-900 (grayscale)

### Typography

- **Headings**: Slate-900, semibold/bold
- **Body**: Slate-700, regular
- **Captions**: Slate-400, small
- **Completed**: Slate-500 with strikethrough

### Spacing

- **Grid Gap**: 4px (Tailwind `gap-1`)
- **Padding**: 6px padding blocks, 1.5rem sections
- **Border Radius**: lg (8px) for inputs, standard for buttons

### Responsive Behavior

- Mobile-first design
- Adjusts padding on smaller screens
- Touch-friendly button sizes (44px+ target)
- Grid adapts: 1 column mobile → 3 columns desktop

## 💾 localStorage Schema

```json
{
  "tasks": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Fix login bug",
      "description": "Users cannot reset password",
      "status": false,
      "createdAt": 1704067200000
    }
  ]
}
```

**Key:** `"tasks"`  
**Value:** JSON stringified Task array

## 🧪 Testing Scenarios

### Create Task
1. Click "Add a new task"
2. Enter title and description
3. Click "Create Task"
4. Verify task appears in pending list

### Complete Task
1. Click checkbox on pending task
2. Verify task moves to completed section
3. Verify visual strikethrough applied

### Edit Task
1. Click edit icon on task
2. Modify title/description
3. Click "Save"
4. Verify changes applied

### Delete Task
1. Click delete icon on task
2. Verify task removed from list
3. Verify counts update

### Persistence
1. Add a task
2. Refresh page
3. Verify task still exists

### Empty State
1. Delete all tasks
2. Verify empty state message appears

## 🔧 Troubleshooting

### Tasks not persisting?
- Check browser's localStorage is enabled
- Open DevTools → Application → localStorage
- Verify "tasks" key exists with valid JSON

### Hydration errors on load?
- `mounted` state check prevents rendering before hydration
- This is expected behavior and handled correctly

### Can't edit/delete tasks?
- Ensure you're not in read-only mode
- Check browser console for errors
- Verify task ID is unique

## 📝 Code Quality

- **TypeScript**: Full type safety throughout
- **React Hooks**: useState for local UI state, useReducer for business logic
- **No Dependencies**: Only Next.js and React (Tailwind is CSS)
- **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation
- **Performance**: No unnecessary re-renders, proper memoization patterns

## 🚀 Performance Considerations

- Tasks limited to localStorage capacity (~5MB)
- Efficient re-renders using React's reconciliation
- No external API calls (offline-first design)
- CSS-only animations (no JavaScript animation)
- Minimal CSS with Tailwind utility classes

## 📦 Build Output

```bash
npm run build
# Generates .next/ folder with optimized build
# Ready for deployment to Vercel, Netlify, etc.
```

## 🎯 Future Enhancements

- **Categories/Tags** for tasks
- **Due dates** with reminders
- **Subtasks** for complex projects
- **Search and filter** functionality
- **Dark mode** toggle
- **Export/Import** task data
- **Cloud sync** (Firebase, Supabase)
- **Collaborative editing** with real-time sync
- **Task analytics** dashboard
- **Priority levels** (High, Medium, Low)

## 📄 License

This project is open source and available for personal and commercial use.

---

**Built with ❤️ using Next.js 14, React 18, and Tailwind CSS**
