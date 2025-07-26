
import { Category, User, TaskStatus } from './types';

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    name: '업무',
    color: '#3b82f6', // blue-500
    subCategories: [
      { id: 'sub-1-1', name: '프로젝트 A' },
      { id: 'sub-1-2', name: '프로젝트 B' },
    ],
  },
  {
    id: 'cat-2',
    name: '휴가',
    color: '#16a34a', // green-600
    subCategories: [
      { id: 'sub-2-1', name: '연차' },
      { id: 'sub-2-2', name: '반차' },
      { id: 'sub-2-3', name: '반반차' },
    ],
  },
  {
    id: 'cat-3',
    name: '회의',
    color: '#f97316', // orange-500
    subCategories: [
      { id: 'sub-3-1', name: '팀 회의' },
      { id: 'sub-3-2', name: '클라이언트 미팅' },
    ],
  },
    {
    id: 'cat-4',
    name: '출장',
    color: '#9333ea', // purple-600
    subCategories: [],
  },
  {
    id: 'cat-5',
    name: '기념일',
    color: '#db2777', // pink-600
    subCategories: [
      { id: 'sub-5-1', name: '생일' },
      { id: 'sub-5-2', name: '결혼기념일' },
    ],
  },
  {
    id: 'cat-6',
    name: '개인',
    color: '#64748b', // slate-500
    subCategories: [
        { id: 'sub-6-1', name: '병원' },
        { id: 'sub-6-2', name: '운동' },
    ]
  }
];

export const MOCK_USER: User = {
    name: 'React User',
    avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d'
};

export const TASK_STATUS_DISPLAY_NAMES: { [key in TaskStatus]: string } = {
  [TaskStatus.ToDo]: 'To Do',
  [TaskStatus.InProgress]: 'In Progress',
  [TaskStatus.Done]: 'Done',
};