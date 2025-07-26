
export interface User {
  name: string;
  avatarUrl: string;
}

export interface SubCategory {
  id: string;
  name: string;
}

export interface Category {
  id:string;
  name: string;
  color: string;
  subCategories: SubCategory[];
}

export enum TaskStatus {
  ToDo = 'ToDo',
  InProgress = 'InProgress',
  Done = 'Done',
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string; // ISO Date string
}

export interface Task {
  id: string;
  content: string;
  status: TaskStatus;
  comments: Comment[];
}

export interface TaskTemplate {
    id: string;
    content: string;
}

export interface Event {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  categoryId: string;
  subCategoryId?: string;
}