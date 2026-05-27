import { useEffect, useState } from 'react';
import { TOAST_DURATION_MS } from '../../constants';

interface ToastProps {
  message: string;
  durationMs?: number;
  onDismiss: () => void;
}

export function Toast({ message, durationMs = TOAST_DURATION_MS, onDismiss }: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(true), 10);
    const slideOutTimer = setTimeout(() => setVisible(false), durationMs - 300);
    const removeTimer = setTimeout(onDismiss, durationMs);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(slideOutTimer);
      clearTimeout(removeTimer);
    };
  }, [durationMs, onDismiss]);

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={[
        'fixed z-50 bg-orange-500 text-white font-semibold px-5 py-3 shadow-lg',
        'transition-all duration-300',
        /* Mobile: full-width strip pinned to the bottom */
        'left-0 right-0 bottom-0 rounded-t-lg text-center',
        /* Desktop: floating bottom-right card */
        'md:left-auto md:right-6 md:bottom-6 md:rounded-lg md:max-w-sm md:text-left',
        visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
      ].join(' ')}
    >
      {message}
    </div>
  );
}
