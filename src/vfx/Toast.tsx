import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onDismiss: () => void;
}

function Toast({ message, type, onDismiss }: ToastProps) {
  useEffect(() => {
    const id = window.setTimeout(onDismiss, 2500);
    return () => window.clearTimeout(id);
  }, [onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="fixed bottom-6 right-6 z-[60] flex max-w-[320px] items-center gap-3 rounded-lg px-4 py-3 bg-[#141416]"
      style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.08)' }}
      role="status"
      aria-live="polite"
    >
      {type === 'success' ? (
        <CheckCircle2
          size={14}
          className="shrink-0 text-emerald-400"
          strokeWidth={2}
          aria-hidden="true"
        />
      ) : (
        <AlertTriangle
          size={14}
          className="shrink-0 text-rose-400"
          strokeWidth={2}
          aria-hidden="true"
        />
      )}
      <span className="flex-1 text-[13px] text-white">{message}</span>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className="ml-auto text-white/40 transition-colors hover:text-white"
      >
        <X size={12} strokeWidth={2} aria-hidden="true" />
      </button>
    </motion.div>
  );
}

interface ToastState {
  message: string;
  type: 'success' | 'error';
}

export function useToast() {
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = useCallback(
    (message: string, type: 'success' | 'error') => {
      setToast({ message, type });
    },
    [],
  );

  const toastElement = (
    <AnimatePresence>
      {toast && (
        <Toast
          key={toast.message + toast.type}
          message={toast.message}
          type={toast.type}
          onDismiss={() => setToast(null)}
        />
      )}
    </AnimatePresence>
  );

  return { showToast, toastElement };
}
