
import React from 'react';
import { Dialog } from './ui/Dialog';
import { GoogleIcon } from './ui/Icons';

interface LoginPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

export const LoginPromptModal: React.FC<LoginPromptModalProps> = ({ isOpen, onClose, onLogin }) => {
  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="로그인이 필요합니다">
      <div className="text-center py-4">
        <p className="text-gray-600 mb-6">
          이 기능을 사용하려면 Google 계정으로 로그인해주세요.
        </p>
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={onLogin}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 text-base font-semibold text-gray-800 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <GoogleIcon className="w-6 h-6" />
            Google 계정으로 로그인
          </button>
          <button onClick={onClose} className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-transparent rounded-lg hover:bg-gray-100">
            나중에 하기
          </button>
        </div>
      </div>
    </Dialog>
  );
};
