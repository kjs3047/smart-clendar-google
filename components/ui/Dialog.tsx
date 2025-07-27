
import React from 'react';
import { X } from './Icons';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  widthClass?: string;
}

export const Dialog: React.FC<DialogProps> = ({ isOpen, onClose, title, children, widthClass = 'sm:max-w-lg' }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onMouseDown={onClose}
    >
      <div
        className={`relative bg-white rounded-lg shadow-xl transform transition-all w-full m-4 ${widthClass}`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between p-4 border-b rounded-t">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <button
            type="button"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
            <span className="sr-only">Close modal</span>
          </button>
        </div>
        <div className="p-6 space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
};
