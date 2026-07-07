"use client";

import { createContext, ReactNode, useCallback, useContext, useRef, useState } from "react";

type ToastItem = { id: number; message: ReactNode };
const ToastContext = createContext<(message: ReactNode) => void>(() => {});

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  const dismiss = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id));
    timers.current.delete(id);
  }, []);

  const show = useCallback((message: ReactNode) => {
    const id = nextId.current++;
    setToasts((t) => [...t, { id, message }]);
    timers.current.set(id, setTimeout(() => dismiss(id), 5000));
  }, [dismiss]);

  const pause = (id: number) => { clearTimeout(timers.current.get(id)); };
  const resume = (id: number) => { timers.current.set(id, setTimeout(() => dismiss(id), 2000)); };

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div className="toast-stack" role="status" aria-live="polite">
        {toasts.map((t) => (
          <span key={t.id} className="toast" onMouseEnter={() => pause(t.id)} onMouseLeave={() => resume(t.id)}>
            {t.message}
          </span>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
