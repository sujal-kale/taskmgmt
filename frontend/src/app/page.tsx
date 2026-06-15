// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import TaskInput from '@/components/TaskInput';
// import TaskList from '@/components/TaskList';
// import { useTasks } from '@/hooks/useTasks';
// import { apiClient, TaskInput as TaskInputData, User } from '@/lib/apiClient';

// export default function TaskManagement() {
//   const router = useRouter();

//   const [authChecked, setAuthChecked] = useState(false);
//   const [currentUser, setCurrentUser] = useState<User | null>(null);

//   const isAuthenticated = authChecked && !!currentUser;

//   const { tasks, loading, error, addTask, deleteTask, updateTask, toggleTask } =
//     useTasks(isAuthenticated);

//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         if (!apiClient.isAuthenticated()) {
//           router.push('/login');
//           return;
//         }

//         const user = await apiClient.getCurrentUser();
//         setCurrentUser(user);
//       } catch (error) {
//         apiClient.logout();
//         router.push('/login');
//       } finally {
//         setAuthChecked(true);
//       }
//     };

//     checkAuth();
//   }, [router]);

//   const handleAddTask = async (taskData: TaskInputData) => {
//     try {
//       console.log('📝 Adding task:', taskData);
//       const newTask = await addTask(taskData);
//       console.log('✅ Task created successfully:', newTask);
//     } catch (err) {
//       console.error('❌ Error adding task:', err);
//       if (err instanceof Error) {
//         alert(`Failed to add task: ${err.message}`);
//       } else {
//         alert('Failed to add task');
//       }
//     }
//   };

//   const handleLogout = () => {
//     apiClient.logout();
//     router.push('/login');
//   };

//   if (!authChecked) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-slate-600">Checking authentication...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!isAuthenticated) {
//     return null;
//   }

//   const completedCount = tasks.filter((task) => task.status).length;
//   const pendingCount = tasks.filter((task) => !task.status).length;

//   if (loading && tasks.length === 0) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-slate-600">Loading tasks...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-3xl mx-auto">
//         {/* Header */}
//         <div className="mb-12 flex items-start justify-between gap-4">
//           <div>
//             <h1 className="text-4xl font-bold text-slate-900 mb-2">Task Manager</h1>
//             <p className="text-lg text-slate-600">
//               Stay organized and track your progress
//             </p>
//             {currentUser && (
//               <p className="text-sm text-slate-500 mt-2">
//                 Logged in as <span className="font-medium">{currentUser.email}</span>
//               </p>
//             )}
//           </div>

//           <button
//             onClick={handleLogout}
//             className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors"
//           >
//             Logout
//           </button>
//         </div>

//         {/* Error Message */}
//         {error && (
//           <div className="mb-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
//             <p className="font-semibold">Error: {error}</p>
//             <p className="text-sm mt-2">Please try again or check the server connection.</p>
//           </div>
//         )}

//         {/* Stats */}
//         <div className="grid grid-cols-3 gap-4 mb-8">
//           <div className="bg-white rounded-lg border border-slate-200 px-4 py-3">
//             <div className="text-sm text-slate-600 font-medium">Total</div>
//             <div className="text-2xl font-bold text-slate-900">{tasks.length}</div>
//           </div>

//           <div className="bg-white rounded-lg border border-slate-200 px-4 py-3">
//             <div className="text-sm text-slate-600 font-medium">Pending</div>
//             <div className="text-2xl font-bold text-amber-600">{pendingCount}</div>
//           </div>

//           <div className="bg-white rounded-lg border border-slate-200 px-4 py-3">
//             <div className="text-sm text-slate-600 font-medium">Completed</div>
//             <div className="text-2xl font-bold text-emerald-600">{completedCount}</div>
//           </div>
//         </div>

//         {/* Input Section */}
//         <div className="mb-8">
//           <TaskInput onAddTask={handleAddTask} />
//         </div>

//         {/* Task List Section */}
//         <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
//           {tasks.length === 0 ? (
//             <div className="px-6 py-12 text-center">
//               <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
//                 <svg
//                   className="w-8 h-8 text-slate-400"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
//                   />
//                 </svg>
//               </div>
//               <h3 className="text-lg font-semibold text-slate-900 mb-1">
//                 No tasks yet
//               </h3>
//               <p className="text-slate-600">
//                 Create your first task to get started
//               </p>
//             </div>
//           ) : (
//             <TaskList
//               tasks={tasks}
//               onDeleteTask={deleteTask}
//               onUpdateTask={updateTask}
//               onToggleTask={toggleTask}
//               loading={loading}
//             />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TaskInput from '@/components/TaskInput';
import TaskList from '@/components/TaskList';
import { useTasks } from '@/hooks/useTasks';
import { apiClient, TaskInput as TaskInputData, User } from '@/lib/apiClient';

export default function TaskManagement() {
  const router = useRouter();

  const [authChecked, setAuthChecked] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const isAuthenticated = authChecked && !!currentUser;

  const { tasks, loading, error, addTask, deleteTask, updateTask, toggleTask } =
    useTasks(isAuthenticated);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!apiClient.isAuthenticated()) {
          router.push('/login');
          return;
        }

        const user = await apiClient.getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        apiClient.logout();
        router.push('/login');
      } finally {
        setAuthChecked(true);
      }
    };

    checkAuth();
  }, [router]);

  const handleAddTask = async (taskData: TaskInputData) => {
    try {
      console.log('📝 Adding task:', taskData);
      const newTask = await addTask(taskData);
      console.log('✅ Task created successfully:', newTask);
    } catch (err) {
      console.error('❌ Error adding task:', err);
      if (err instanceof Error) {
        alert(`Failed to add task: ${err.message}`);
      } else {
        alert('Failed to add task');
      }
    }
  };

  const handleLogout = () => {
    apiClient.logout();
    router.push('/login');
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.15),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.12),_transparent_22%),linear-gradient(135deg,_#f8fafc_0%,_#eef2ff_45%,_#f8fafc_100%)] flex items-center justify-center px-4">
        <div className="rounded-3xl border border-white/60 bg-white/70 backdrop-blur-xl shadow-xl shadow-slate-200/60 px-8 py-10 text-center max-w-sm w-full">
          <div className="animate-spin rounded-full h-12 w-12 border-[3px] border-slate-200 border-t-blue-600 mx-auto mb-5"></div>
          <p className="text-slate-700 font-medium text-base">Checking authentication...</p>
          <p className="text-sm text-slate-500 mt-2">Preparing your workspace</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const completedCount = tasks.filter((task) => task.status).length;
  const pendingCount = tasks.filter((task) => !task.status).length;

  if (loading && tasks.length === 0) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.15),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.12),_transparent_22%),linear-gradient(135deg,_#f8fafc_0%,_#eef2ff_45%,_#f8fafc_100%)] flex items-center justify-center px-4">
        <div className="rounded-3xl border border-white/60 bg-white/70 backdrop-blur-xl shadow-xl shadow-slate-200/60 px-8 py-10 text-center max-w-sm w-full">
          <div className="animate-spin rounded-full h-12 w-12 border-[3px] border-slate-200 border-t-blue-600 mx-auto mb-5"></div>
          <p className="text-slate-700 font-medium text-base">Loading tasks...</p>
          <p className="text-sm text-slate-500 mt-2">Fetching your latest updates</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.15),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.12),_transparent_22%),linear-gradient(135deg,_#f8fafc_0%,_#eef2ff_45%,_#f8fafc_100%)] py-8 sm:py-10 lg:py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 sm:mb-10 lg:mb-12 rounded-3xl border border-white/70 bg-white/75 backdrop-blur-xl shadow-[0_20px_80px_-20px_rgba(15,23,42,0.18)] px-6 py-6 sm:px-8 sm:py-7">
          <div className="flex flex-col gap-6 sm:gap-5 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700 mb-4">
                Productivity Dashboard
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">
                Task Manager
              </h1>

              <p className="mt-3 text-sm sm:text-base lg:text-lg text-slate-600 max-w-2xl leading-relaxed">
                Stay organized, prioritize what matters, and keep track of your progress with a cleaner workflow.
              </p>

              {currentUser && (
                <div className="mt-4 inline-flex max-w-full items-center gap-2 rounded-full bg-slate-100/80 px-3 py-1.5 text-sm text-slate-600">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.15)]"></span>
                  <span className="truncate">
                    Logged in as <span className="font-semibold text-slate-800">{currentUser.email}</span>
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-xl hover:shadow-slate-900/20 active:translate-y-0"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 rounded-2xl border border-red-200 bg-red-50/90 px-5 py-4 text-red-700 shadow-sm">
            <p className="font-semibold">Error: {error}</p>
            <p className="text-sm mt-1.5 text-red-600/90">
              Please try again or check the server connection.
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-8">
          <div className="group relative overflow-hidden rounded-2xl border border-white/70 bg-white/80 backdrop-blur-xl px-5 py-5 shadow-[0_12px_40px_-18px_rgba(15,23,42,0.25)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_-20px_rgba(59,130,246,0.25)]">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-400"></div>
            <div className="text-xs sm:text-sm text-slate-500 font-semibold uppercase tracking-wide">Total</div>
            <div className="mt-2 text-3xl font-bold text-slate-900">{tasks.length}</div>
            <div className="mt-2 text-sm text-slate-500">All your tracked tasks</div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-white/70 bg-white/80 backdrop-blur-xl px-5 py-5 shadow-[0_12px_40px_-18px_rgba(15,23,42,0.25)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_-20px_rgba(245,158,11,0.28)]">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-500 to-orange-400"></div>
            <div className="text-xs sm:text-sm text-slate-500 font-semibold uppercase tracking-wide">Pending</div>
            <div className="mt-2 text-3xl font-bold text-amber-600">{pendingCount}</div>
            <div className="mt-2 text-sm text-slate-500">Tasks waiting to be completed</div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-white/70 bg-white/80 backdrop-blur-xl px-5 py-5 shadow-[0_12px_40px_-18px_rgba(15,23,42,0.25)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_-20px_rgba(16,185,129,0.28)]">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400"></div>
            <div className="text-xs sm:text-sm text-slate-500 font-semibold uppercase tracking-wide">Completed</div>
            <div className="mt-2 text-3xl font-bold text-emerald-600">{completedCount}</div>
            <div className="mt-2 text-sm text-slate-500">Tasks you’ve finished</div>
          </div>
        </div>

        {/* Input Section */}
        <div className="mb-8 rounded-3xl border border-white/70 bg-white/75 backdrop-blur-xl shadow-[0_20px_70px_-28px_rgba(15,23,42,0.22)] p-4 sm:p-5 lg:p-6">
          <TaskInput onAddTask={handleAddTask} />
        </div>

        {/* Task List Section */}
        <div className="overflow-hidden rounded-3xl border border-white/70 bg-white/80 backdrop-blur-xl shadow-[0_20px_80px_-24px_rgba(15,23,42,0.22)]">
          {tasks.length === 0 ? (
            <div className="px-6 py-14 sm:px-10 sm:py-16 text-center">
              <div className="mx-auto mb-5 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 text-blue-500 shadow-inner ring-1 ring-blue-100">
                <svg
                  className="w-9 h-9"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                No tasks yet
              </h3>
              <p className="text-slate-600 max-w-md mx-auto leading-relaxed">
                Create your first task to get started and build momentum with a more organized daily workflow.
              </p>
            </div>
          ) : (
            <TaskList
              tasks={tasks}
              onDeleteTask={deleteTask}
              onUpdateTask={updateTask}
              onToggleTask={toggleTask}
              loading={loading}
            />
          )}
        </div>
      </div>
    </div>
  );
}
