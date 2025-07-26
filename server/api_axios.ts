import axios, { AxiosInstance } from "axios";
import { Event, Category, User, Task, TaskTemplate } from "../types";

// Function to determine the backend URL based on the environment
const getBackendUrl = (): string => {
  if (typeof window !== "undefined") {
    const { protocol, hostname } = window.location;
    // For cloud IDEs like Gitpod or GitHub Codespaces which use port forwarding in the URL
    if (hostname.includes("gitpod.io") || hostname.includes("github.dev")) {
      // Replaces the frontend port in the hostname with the backend port (3001)
      const backendHostname = hostname.replace(/-\d+./, "-3001.");
      return `${protocol}//${backendHostname}`;
    }
  }
  // Default for local development
  return "http://localhost:3001";
};

export const BACKEND_URL = getBackendUrl();

const axiosInstance: AxiosInstance = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for session management with cookies
});

// --- API Functions ---

// User Authentication
export const apiLogout = async (): Promise<void> => {
  await axiosInstance.post("/auth/logout");
};

export const apiGetCurrentUser = async (): Promise<User | null> => {
  try {
    const { data } = await axiosInstance.get<User>("/auth/user");
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      // Not logged in, which is a valid state, not an error.
      return null;
    }
    // For other errors (e.g. network), we re-throw.
    console.error("Error getting current user:", error);
    throw error;
  }
};

// Events
export const apiGetEvents = async (): Promise<Event[]> => {
  const { data } = await axiosInstance.get<Event[]>("/v1/events");
  return data;
};

export const apiSaveEvent = async (eventToSave: Event, isNew: boolean): Promise<Event> => {
  if (isNew) {
    // For new events, we POST. The backend will generate a permanent ID.
    const { data } = await axiosInstance.post<Event>("/v1/events", eventToSave);
    return data;
  } else {
    // For existing events, we PUT to update.
    const { data } = await axiosInstance.put<Event>(`/v1/events/${eventToSave.id}`, eventToSave);
    return data;
  }
};

export const apiDeleteEvent = async (eventId: string): Promise<void> => {
  await axiosInstance.delete(`/v1/events/${eventId}`);
};

// Categories
export const apiGetCategories = async (): Promise<Category[]> => {
  const { data } = await axiosInstance.get<Category[]>("/v1/categories");
  return data;
};

export const apiSaveCategories = async (categories: Category[]): Promise<Category[]> => {
  const { data } = await axiosInstance.put<Category[]>("/v1/categories", categories);
  return data;
};

// Tasks (now event-specific)
export const apiGetTasksForEvent = async (eventId: string): Promise<Task[]> => {
  const { data } = await axiosInstance.get<Task[]>(`/v1/events/${eventId}/tasks`);
  return data;
};

export const apiUpdateTasksForEvent = async (eventId: string, tasks: Task[]): Promise<Task[]> => {
  const { data } = await axiosInstance.put<Task[]>(`/v1/events/${eventId}/tasks`, tasks);
  return data;
};

// Task Templates
export const apiGetTaskTemplates = async (): Promise<{ [subCategoryId: string]: TaskTemplate[] }> => {
  const { data } = await axiosInstance.get<{ [subCategoryId: string]: TaskTemplate[] }>("/v1/task-templates");
  return data;
};

export const apiSaveTaskTemplates = async (templates: {
  [subCategoryId: string]: TaskTemplate[];
}): Promise<{ [subCategoryId: string]: TaskTemplate[] }> => {
  const { data } = await axiosInstance.put<{ [subCategoryId: string]: TaskTemplate[] }>(
    "/v1/task-templates",
    templates
  );
  return data;
};
