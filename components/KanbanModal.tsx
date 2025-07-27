import React, { useState, useCallback } from 'react';
import { Event, Task, TaskStatus, TaskTemplate, User } from '../types';
import { Dialog } from './ui/Dialog';
import { GripVertical, Plus, Trash2 } from './ui/Icons';
import { TaskDetailModal } from './TaskDetailModal';
import { TASK_STATUS_DISPLAY_NAMES } from '../constants';

interface KanbanColumnProps {
    status: TaskStatus;
    tasks: Task[];
    onDragStart: (e: React.DragEvent<HTMLDivElement>, taskId: string) => void;
    onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
    onDrop: (e: React.DragEvent<HTMLDivElement>, status: TaskStatus) => void;
    onTaskClick: (task: Task) => void;
    onDeleteTask: (taskId: string) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ status, tasks, onDragStart, onDragOver, onDrop, onTaskClick, onDeleteTask }) => {
    return (
        <div 
            className="flex-1 p-3 bg-gray-100 rounded-lg"
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, status)}
        >
            <h3 className="font-semibold mb-3 text-center text-gray-700">{TASK_STATUS_DISPLAY_NAMES[status]}</h3>
            <div className="space-y-2 min-h-[100px]">
                {tasks.map(task => (
                    <div 
                        key={task.id} 
                        className="group p-3 bg-white rounded-md shadow flex items-center gap-2 cursor-pointer hover:bg-gray-50 active:cursor-grabbing"
                        draggable
                        onDragStart={(e) => onDragStart(e, task.id)}
                        onClick={() => onTaskClick(task)}
                    >
                        <GripVertical className="h-5 w-5 text-gray-400" />
                        <span className="flex-1">{task.content}</span>
                         {task.comments.length > 0 && <span className="text-xs text-gray-500">{task.comments.length}</span>}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDeleteTask(task.id);
                            }}
                            aria-label="태스크 삭제"
                            className="ml-auto text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

interface KanbanModalProps {
    isOpen: boolean;
    onClose: () => void;
    event: Event | null;
    tasks: Task[];
    onUpdateTasks: (tasks: Task[]) => void;
    onDeleteEvent: (eventId: string) => void;
    taskTemplates: TaskTemplate[];
    currentUser: User | null;
}

export const KanbanModal: React.FC<KanbanModalProps> = ({ isOpen, onClose, event, tasks, onUpdateTasks, onDeleteEvent, taskTemplates, currentUser }) => {
  const [newTaskContent, setNewTaskContent] = useState('');
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false);
    
  const handleDeleteTask = useCallback((taskId: string) => {
    if (window.confirm('이 태스크를 삭제하시겠습니까?')) {
        const updatedTasks = tasks.filter(t => t.id !== taskId);
        onUpdateTasks(updatedTasks);
    }
  }, [tasks, onUpdateTasks]);

  const handleUpdateSingleTask = useCallback((updatedTask: Task) => {
      const updatedTasks = tasks.map(t => t.id === updatedTask.id ? updatedTask : t);
      onUpdateTasks(updatedTasks);
      setSelectedTask(updatedTask); // Instantly update the task in the detail modal
  }, [tasks, onUpdateTasks]);

  if (!event) return null;

  const handleAddTask = () => {
    if (!newTaskContent.trim()) return;
    const newTask: Task = {
      id: `task-${Date.now()}`,
      content: newTaskContent,
      status: TaskStatus.ToDo,
      comments: [],
    };
    onUpdateTasks([...tasks, newTask]);
    setNewTaskContent('');
  };

  const handleAddTaskFromTemplate = (template: TaskTemplate) => {
    const newTask: Task = {
        id: `task-${Date.now()}`,
        content: template.content,
        status: TaskStatus.ToDo,
        comments: [],
    };
    onUpdateTasks([...tasks, newTask]);
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, newStatus: TaskStatus) => {
    e.preventDefault();
    if (!draggedTaskId) return;
    const updatedTasks = tasks.map(task => 
        task.id === draggedTaskId ? { ...task, status: newStatus } : task
    );
    onUpdateTasks(updatedTasks);
    setDraggedTaskId(null);
  };
  
  const handleDelete = () => {
    if (event) {
        onDeleteEvent(event.id);
        // The modal is now closed by App.tsx's handleDeleteEvent to prevent race conditions.
    }
  };

  const handleTaskClick = (task: Task) => {
      setSelectedTask(task);
      setIsTaskDetailOpen(true);
  };

  const columns: TaskStatus[] = [TaskStatus.ToDo, TaskStatus.InProgress, TaskStatus.Done];

  return (
    <>
    <Dialog isOpen={isOpen} onClose={onClose} title={`칸반 보드: ${event.title}`} widthClass="sm:max-w-4xl lg:max-w-6xl">
      <div className="space-y-4">
        {/* Add new task input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newTaskContent}
            onChange={(e) => setNewTaskContent(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
            placeholder="새로운 할 일 추가..."
            className="flex-grow p-2 border rounded-md"
          />
          <button onClick={handleAddTask} className="p-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
            <Plus className="h-5 w-5" />
          </button>
        </div>

        {/* Pre-defined task templates */}
        {taskTemplates.length > 0 && (
            <div className="p-3 border rounded-lg bg-gray-50">
                <h4 className="text-sm font-semibold mb-2 text-gray-600">사전 정의 태스크</h4>
                <div className="flex flex-wrap gap-2">
                    {taskTemplates.map(template => (
                        <button key={template.id} onClick={() => handleAddTaskFromTemplate(template)} className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-primary bg-blue-100 rounded-full hover:bg-blue-200">
                           <Plus className="w-3 h-3" />
                           {template.content}
                        </button>
                    ))}
                </div>
            </div>
        )}
        
        {/* Kanban columns */}
        <div className="flex flex-col md:flex-row gap-4">
          {columns.map(status => (
            <KanbanColumn
                key={status}
                status={status}
                tasks={tasks.filter(t => t.status === status)}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onTaskClick={handleTaskClick}
                onDeleteTask={handleDeleteTask}
            />
          ))}
        </div>
        <div className="flex justify-between items-center pt-4 mt-4 border-t">
           <button onClick={handleDelete} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-transparent rounded-lg hover:bg-red-50 focus:z-10 focus:ring-2 focus:ring-red-500">
                <Trash2 className="w-4 h-4" />
                일정 삭제
            </button>
            <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100">
                닫기
            </button>
        </div>
      </div>
    </Dialog>
    <TaskDetailModal
        isOpen={isTaskDetailOpen}
        onClose={() => setIsTaskDetailOpen(false)}
        task={selectedTask}
        onUpdateTask={handleUpdateSingleTask}
        currentUser={currentUser}
    />
    </>
  );
};