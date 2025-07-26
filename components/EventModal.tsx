
import React, { useState, useEffect } from 'react';
import { Event, Category } from '../types';
import { Dialog } from './ui/Dialog';
import { Trash2 } from './ui/Icons';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Event) => void;
  onDelete?: (eventId: string) => void;
  event: Event | null;
  categories: Category[];
  selectedDate: Date;
}

export const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, onSave, onDelete, event, categories, selectedDate }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [categoryId, setCategoryId] = useState('');
  const [subCategoryId, setSubCategoryId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (isOpen) {
        const initialDate = event ? event.date : selectedDate.toISOString().split('T')[0];
        setDate(initialDate);
        setTitle(event?.title || '');
        setStartTime(event?.startTime || '09:00');
        setEndTime(event?.endTime || '10:00');
        setCategoryId(event?.categoryId || (categories.length > 0 ? categories[0].id : ''));
        setSubCategoryId(event?.subCategoryId || undefined);
    }
  }, [event, isOpen, selectedDate, categories]);

  const handleSave = () => {
    if (!title.trim() || !categoryId) return;
    const savedEvent: Event = {
      id: event?.id || `evt-${Date.now()}`,
      title,
      date,
      startTime,
      endTime,
      categoryId,
      subCategoryId,
    };
    onSave(savedEvent);
    onClose();
  };
  
  const handleDelete = () => {
      if(event && onDelete) {
          onDelete(event.id);
          onClose();
      }
  };

  const selectedCategory = categories.find(c => c.id === categoryId);

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={event ? '일정 편집' : '새 일정 추가'}>
      <div className="space-y-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">제목</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="예: 팀 미팅"
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">날짜</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">시작 시간</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">종료 시간</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">카테고리</label>
              <select
                value={categoryId}
                onChange={(e) => {
                    setCategoryId(e.target.value);
                    setSubCategoryId(undefined);
                }}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            {selectedCategory && selectedCategory.subCategories.length > 0 && (
                 <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900">하위 카테고리</label>
                    <select
                        value={subCategoryId || ''}
                        onChange={(e) => setSubCategoryId(e.target.value || undefined)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    >
                        <option value="">선택 안함</option>
                        {selectedCategory.subCategories.map(sub => (
                            <option key={sub.id} value={sub.id}>{sub.name}</option>
                        ))}
                    </select>
                 </div>
            )}
        </div>
        <div className="flex justify-between items-center pt-4">
           <div>
            {event && onDelete && (
                <button onClick={handleDelete} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-transparent rounded-lg hover:bg-red-50 focus:z-10 focus:ring-2 focus:ring-red-500">
                    <Trash2 className="w-4 h-4" />
                    삭제
                </button>
            )}
           </div>
           <div className="flex gap-2">
                <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100">
                    취소
                </button>
                <button onClick={handleSave} className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90">
                    저장
                </button>
           </div>
        </div>
      </div>
    </Dialog>
  );
};
