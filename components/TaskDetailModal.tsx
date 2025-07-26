
import React, { useState, useEffect, useRef } from 'react';
import { Task, User, Comment } from '../types';
import { Dialog } from './ui/Dialog';

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onUpdateTask: (task: Task) => void;
  currentUser: User | null;
}

const formatTimestamp = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString('ko-KR', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    }).replace(/\. /g, '.');
};

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ isOpen, onClose, task, onUpdateTask, currentUser }) => {
  const [newComment, setNewComment] = useState('');
  const commentsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setNewComment('');
      // Scroll to bottom when modal opens or task changes
      commentsEndRef.current?.scrollIntoView();
    }
  }, [isOpen, task]);
  
  useEffect(() => {
      // Scroll to bottom when new comments are added
      commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [task?.comments]);


  if (!task) return null;

  const handleAddComment = () => {
    if (!newComment.trim() || !currentUser) return;

    const comment: Comment = {
      id: `comment-${Date.now()}`,
      author: currentUser.name,
      content: newComment,
      createdAt: new Date().toISOString(),
    };
    
    const updatedTask = {
        ...task,
        comments: [...task.comments, comment]
    };

    onUpdateTask(updatedTask);
    setNewComment('');
  };
  
  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="태스크 상세 및 댓글" widthClass="sm:max-w-2xl">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">태스크 내용</h3>
          <p className="p-3 bg-gray-50 rounded-md text-gray-700">{task.content}</p>
        </div>
        
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-800">댓글</h3>
          <div className="max-h-60 overflow-y-auto space-y-3 p-3 bg-gray-50 rounded-md border">
            {task.comments.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">아직 댓글이 없습니다.</p>
            ) : (
                task.comments.map(comment => (
                    <div key={comment.id} className="flex flex-col items-start">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm text-gray-800">{comment.author}</span>
                            <span className="text-xs text-gray-500">{formatTimestamp(comment.createdAt)}</span>
                        </div>
                        <div className="bg-white p-2.5 rounded-lg border w-full">
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                        </div>
                    </div>
                ))
            )}
             <div ref={commentsEndRef} />
          </div>
        </div>

        {currentUser && (
            <div>
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleAddComment();
                        }
                    }}
                    placeholder="댓글을 추가하세요 (Enter로 전송, Shift+Enter로 줄바꿈)..."
                    className="w-full p-2 border rounded-md"
                    rows={3}
                />
                <div className="flex justify-end mt-2">
                    <button 
                        onClick={handleAddComment}
                        disabled={!newComment.trim()}
                        className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 disabled:bg-primary/50 disabled:cursor-not-allowed"
                    >
                        댓글 추가
                    </button>
                </div>
            </div>
        )}
      </div>
    </Dialog>
  );
};