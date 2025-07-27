import { Event, Category, User, Task, TaskTemplate } from "@/types";

const API_BASE = '/api';

// --- API Functions ---

// User Authentication
export const apiLogout = async (): Promise<void> => {
  const response = await fetch(`${API_BASE}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Logout failed');
  }
};

export const apiGetCurrentUser = async (): Promise<User | null> => {
  try {
    const response = await fetch(`${API_BASE}/auth/user`, {
      credentials: 'include',
    });
    if (response.status === 401) {
      return null;
    }
    if (!response.ok) {
      throw new Error('Failed to get current user');
    }
    return await response.json();
  } catch (error) {
    console.error("Error getting current user:", error);
    throw error;
  }
};

// Events
export const apiGetEvents = async (): Promise<Event[]> => {
  const response = await fetch(`${API_BASE}/v1/events`, {
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Failed to get events');
  }
  return await response.json();
};

export const apiSaveEvent = async (eventToSave: Event, isNew: boolean): Promise<Event> => {
  const url = isNew ? `${API_BASE}/v1/events` : `${API_BASE}/v1/events/${eventToSave.id}`;
  const method = isNew ? 'POST' : 'PUT';
  
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(eventToSave),
    credentials: 'include',
  });
  
  if (!response.ok) {
    throw new Error('Failed to save event');
  }
  return await response.json();
};

export const apiDeleteEvent = async (eventId: string): Promise<void> => {
  const response = await fetch(`${API_BASE}/v1/events/${eventId}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Failed to delete event');
  }
};

// Categories
export const apiGetCategories = async (): Promise<Category[]> => {
  const response = await fetch(`${API_BASE}/v1/categories`, {
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Failed to get categories');
  }
  return await response.json();
};

export const apiSaveCategories = async (categories: Category[]): Promise<Category[]> => {
  const response = await fetch(`${API_BASE}/v1/categories`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(categories),
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Failed to save categories');
  }
  return await response.json();
};

// Tasks (now event-specific)
export const apiGetTasksForEvent = async (eventId: string): Promise<Task[]> => {
  const response = await fetch(`${API_BASE}/v1/events/${eventId}/tasks`, {
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Failed to get tasks for event');
  }
  return await response.json();
};

export const apiUpdateTasksForEvent = async (eventId: string, tasks: Task[]): Promise<Task[]> => {
  const response = await fetch(`${API_BASE}/v1/events/${eventId}/tasks`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(tasks),
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Failed to update tasks for event');
  }
  return await response.json();
};

// Task Templates
export const apiGetTaskTemplates = async (): Promise<{ [subCategoryId: string]: TaskTemplate[] }> => {
  const response = await fetch(`${API_BASE}/v1/task-templates`, {
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Failed to get task templates');
  }
  return await response.json();
};

export const apiSaveTaskTemplates = async (templates: {
  [subCategoryId: string]: TaskTemplate[];
}): Promise<{ [subCategoryId: string]: TaskTemplate[] }> => {
  const response = await fetch(`${API_BASE}/v1/task-templates`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(templates),
    credentials: 'include',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    if (errorData?.message === 'DUPLICATE_CONTENT') {
      const duplicates = errorData.duplicates || [];
      throw new Error(`DUPLICATE_CONTENT: ${duplicates.join(', ')}`);
    }
    throw new Error('Failed to save task templates');
  }
  return await response.json();
};