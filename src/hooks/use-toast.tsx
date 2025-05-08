// src/hooks/use-toast.tsx
// Hook customizado para exibir toasts (notificações flutuantes) com suporte a dark/light mode.
// Use: import { useToast, ToastProvider } from '@/hooks/use-toast';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextProps {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = (message: string, type: ToastType = 'info') => {
    setToasts((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), message, type }
    ]);
    setTimeout(() => {
      setToasts((prev) => prev.slice(1));
    }, 3500);
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <ToastViewport toasts={toasts} />
    </ToastContext.Provider>
  );
};

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast deve ser usado dentro de ToastProvider');
  }
  return context.toast;
}

// Componente que exibe os toasts na tela
function ToastViewport({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="fixed z-50 right-4 bottom-4 flex flex-col gap-2 max-w-xs">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`px-4 py-3 rounded shadow-lg text-sm font-medium transition-all
            ${toast.type === 'success' ? 'bg-green-500 text-white' : ''}
            ${toast.type === 'error' ? 'bg-red-500 text-white' : ''}
            ${toast.type === 'info' ? 'bg-blue-500 text-white' : ''}
            ${toast.type === 'warning' ? 'bg-yellow-400 text-gray-900' : ''}
            dark:${toast.type === 'success' ? 'bg-green-600 text-white' : ''}
            dark:${toast.type === 'error' ? 'bg-red-600 text-white' : ''}
            dark:${toast.type === 'info' ? 'bg-blue-600 text-white' : ''}
            dark:${toast.type === 'warning' ? 'bg-yellow-500 text-gray-900' : ''}
          `}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
