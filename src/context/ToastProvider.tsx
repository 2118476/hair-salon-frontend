import React, { useCallback, useState } from 'react';
import { Toast } from '../components/ui/Toast';
import { ToastContext, ToastType } from './toast-context';

interface Item {
  id: number;
  message: string;
  type: ToastType;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Item[]>([]);

  const show = useCallback((message: string, type: ToastType = 'info') => {
    const id = Date.now() + Math.random();
    setItems((s) => [...s, { id, message, type }]);
    window.setTimeout(() => setItems((s) => s.filter((i) => i.id !== id)), 3500);
  }, []);

  const remove = (id: number) => setItems((s) => s.filter((i) => i.id !== id));

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {items.map((i, idx) => (
        <div key={i.id} style={{ bottom: `${1 + idx * 3.5}rem` }} className="fixed right-4 z-50">
          <Toast message={i.message} type={i.type} onClose={() => remove(i.id)} />
        </div>
      ))}
    </ToastContext.Provider>
  );
}
