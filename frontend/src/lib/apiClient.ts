

//     return handleResponse<Task>(response, 'Failed to update task');
//   },

//   async deleteTask(taskId: number): Promise<void> {
//     const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
//       method: 'DELETE',
//       headers: getAuthHeaders(),
//     });

//     if (!response.ok) {
//       let data: any = null;
//       try {
//         data = await response.json();
//       } catch {
//         // ignore
//       }

//       if (response.status === 401) {
//         tokenStorage.remove();
//       }

//       throw new APIError(
//         response.status,
//         data?.detail || 'Failed to delete task',
//         data
//       );
//     }
//   },

//   async toggleTask(taskId: number): Promise<Task> {
//     const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}/toggle`, {
//       method: 'PATCH',
//       headers: getAuthHeaders(),
//     });

//     return handleResponse<Task>(response, 'Failed to toggle task');
//   },
// };


const API_BASE_URL =
  (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/+$/, '');

export interface Task {
  id: number;
  uuid: string;
  title: string;
  description: string;
  status: boolean;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface TaskInput {
  title: string;
  description: string;
}

export interface AuthPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface User {
  id: number;
  email: string;
  created_at: string;
}

export class APIError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export const tokenStorage = {
  get: () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null),
  set: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  },
  remove: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  },
};

const getAuthHeaders = () => {
  const token = tokenStorage.get();

  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

async function handleResponse<T>(response: Response, fallbackMessage: string): Promise<T> {
  let data: any = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    if (response.status === 401) {
      tokenStorage.remove();
    }

    throw new APIError(
      response.status,
      data?.detail || fallbackMessage,
      data
    );
  }

  return data as T;
}

export const apiClient = {
  async register(payload: AuthPayload): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await handleResponse<AuthResponse>(response, 'Failed to register');
    tokenStorage.set(data.access_token);
    return data;
  },

  async login(payload: AuthPayload): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await handleResponse<AuthResponse>(response, 'Failed to login');
  tokenStorage.set(data.access_token);
  return data;
  },

  async getCurrentUser(): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    return handleResponse<User>(response, 'Failed to fetch current user');
  },

  logout(): void {
    tokenStorage.remove();
  },

  isAuthenticated(): boolean {
    return !!tokenStorage.get();
  },

  async createTask(data: TaskInput): Promise<Task> {
    const token = tokenStorage.get();
    console.log('Auth token present:', !!token);
    console.log('Sending POST to:', `${API_BASE_URL}/api/tasks`);
    console.log(' Payload:', data);
    
    const response = await fetch(`${API_BASE_URL}/api/tasks`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    console.log('📥 Response status:', response.status);
    console.log('📥 Response headers:', {
      'content-type': response.headers.get('content-type'),
    });

    const result = await handleResponse<Task>(response, 'Failed to create task');
    console.log('✅ Task created:', result);
    return result;
  },

  async getAllTasks(skip: number = 0, limit: number = 100): Promise<{ total: number; tasks: Task[] }> {
    const params = new URLSearchParams({
      skip: skip.toString(),
      limit: limit.toString(),
    });

    const response = await fetch(`${API_BASE_URL}/api/tasks?${params.toString()}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    return handleResponse<{ total: number; tasks: Task[] }>(response, 'Failed to fetch tasks');
  },

  async getTask(taskId: number): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    return handleResponse<Task>(response, 'Failed to fetch task');
  },

  async updateTask(taskId: number, data: Partial<TaskInput>): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    return handleResponse<Task>(response, 'Failed to update task');
  },

  async deleteTask(taskId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      let data: any = null;
      try {
        data = await response.json();
      } catch {
        data = null;
      }

      throw new APIError(response.status, data?.detail || 'Failed to delete task', data);
    }
  },

  async toggleTask(taskId: number): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}/toggle`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });

    return handleResponse<Task>(response, 'Failed to toggle task');
  },
};
