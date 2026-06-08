import { useEffect, useRef } from 'react';
import { Spinner } from '../ui/Spinner';
import type { ConsoleEntry, ConsoleState } from '../../types';

interface ConsoleModalProps {
  state: ConsoleState;
  messages: ConsoleEntry[];
  /** Called when X is clicked while loading — aborts the request. */
  onCancel: () => void;
  /** Called when X is clicked after completion — dismisses the panel. */
  onDismiss: () => void;
}

export function ConsoleModal({ state, messages, onCancel, onDismiss }: ConsoleModalProps) {
  const isLoading = state === 'loading';
  const handleX = isLoading ? onCancel : onDismiss;
  const xLabel = isLoading ? 'Cancel request' : 'Dismiss';
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  return (
    <div className="console-modal" role="log" aria-live="polite" aria-label="Request status">
      <div className="console-modal-header">
        <span className="console-modal-title">
          {isLoading && <Spinner size="sm" className="text-green-500" />}
          {state === 'success' && (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"
              className="w-3.5 h-3.5 text-green-500" aria-hidden="true">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          )}
          {state === 'error' && (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"
              className="w-3.5 h-3.5 text-red-400" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          )}
          <span className="console-modal-status-text">
            {isLoading ? 'Processing…' : state === 'success' ? 'Done' : 'Failed'}
          </span>
        </span>

        <button
          type="button"
          onClick={handleX}
          aria-label={xLabel}
          className="console-modal-close-btn"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
            className="w-3.5 h-3.5" aria-hidden="true">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="console-modal-body" ref={bodyRef}>
        {messages.length === 0 ? (
          <div className="console-entry console-entry--info">...</div>
        ) : (
          messages.map((entry) => (
            <div key={entry.id} className={`console-entry console-entry--${entry.type}`}>
              {entry.text}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
