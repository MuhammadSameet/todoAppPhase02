/**
 * API client for communicating with the backend.
 */

// Use Hugging Face backend URL for production
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://sameetshahid02-todoapp-phase02-backend.hf.space';

/**
 * Get stored user ID from localStorage.
 */
function getUserId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('user_id');
}

/**
 * Make an authenticated API request.
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const userId = getUserId();

  if (!userId) {
    throw new Error('Not authenticated - please login');
  }

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${userId}`,
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Request failed' }));
    
    if (response.status === 401) {
      throw new Error('Authentication required - please login');
    }
    
    if (response.status === 404) {
      throw new Error('Resource not found');
    }

    throw new Error(error.detail || `HTTP ${response.status}`);
  }

  return response.json();
}
/**
 * Task types.
 */
export interface Task {
  id: number;
  user_id: string;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface TaskCreate {
  title: string;
  description?: string;
}

export interface TaskUpdate {
  title?: string;
  description?: string;
  completed?: boolean;
}

/**
 * Task API functions.
 */
export const tasksApi = {
  /**
   * List all tasks for the current user.
   */
  async list(statusFilter?: 'all' | 'complete' | 'incomplete'): Promise<Task[]> {
    const userId = getUserId();
    if (!userId) throw new Error('Not authenticated');
    
    const params = statusFilter && statusFilter !== 'all' 
      ? `?status=${statusFilter}` 
      : '';
    return apiRequest<Task[]>(`/api/${userId}/tasks${params}`);
  },

  /**
   * Create a new task.
   */
  async create(data: TaskCreate): Promise<Task> {
    const userId = getUserId();
    if (!userId) throw new Error('Not authenticated');
    
    return apiRequest<Task>(`/api/${userId}/tasks`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Get a single task by ID.
   */
  async get(id: number): Promise<Task> {
    const userId = getUserId();
    if (!userId) throw new Error('Not authenticated');
    
    return apiRequest<Task>(`/api/${userId}/tasks/${id}`);
  },

  /**
   * Update a task.
   */
  async update(id: number, data: TaskUpdate): Promise<Task> {
    const userId = getUserId();
    if (!userId) throw new Error('Not authenticated');
    
    return apiRequest<Task>(`/api/${userId}/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete a task.
   */
  async delete(id: number): Promise<{ message: string }> {
    const userId = getUserId();
    if (!userId) throw new Error('Not authenticated');
    
    return apiRequest<{ message: string }>(`/api/${userId}/tasks/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Toggle task completion status.
   */
  async toggle(id: number): Promise<Task> {
    const userId = getUserId();
    if (!userId) throw new Error('Not authenticated');
    
    return apiRequest<Task>(`/api/${userId}/tasks/${id}/complete`, {
      method: 'PATCH',
    });
  },
};
