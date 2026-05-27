import { Spinner } from '../ui/Spinner';

interface SendButtonProps {
  isLoading: boolean;
  disabled: boolean;
  onClick: () => void;
}

export function SendButton({ isLoading, disabled, onClick }: SendButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || isLoading}
      aria-label={isLoading ? 'Loading…' : 'Send'}
      className={[
        'flex items-center justify-center w-8 h-8 shrink-0 rounded transition-opacity duration-200',
        disabled && !isLoading ? 'opacity-40 cursor-not-allowed' : 'opacity-100 cursor-pointer',
      ].join(' ')}
    >
      {isLoading ? (
        <Spinner size="md" className="text-green-500" />
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6 text-green-500"
          aria-hidden="true"
        >
          <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
        </svg>
      )}
    </button>
  );
}
