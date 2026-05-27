interface FileChipProps {
  name: string;
  onRemove: () => void;
}

export function FileChip({ name, onRemove }: FileChipProps) {
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-full text-sm text-neutral-700 dark:text-neutral-200 max-w-xs">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="currentColor"
        className="w-3.5 h-3.5 text-green-500 shrink-0"
        aria-hidden="true"
      >
        <path d="M4 1.75A2.75 2.75 0 0 1 6.75 4v4.5a.75.75 0 0 0 1.5 0V4a4.25 4.25 0 0 0-8.5 0v5.25a5.75 5.75 0 0 0 11.5 0V4.5a.75.75 0 0 0-1.5 0v4.75a4.25 4.25 0 0 1-8.5 0V4A1.25 1.25 0 0 1 4 2.75h.5a.75.75 0 0 0 0-1.5H4Z" />
      </svg>
      <span className="truncate">{name}</span>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${name}`}
        className="shrink-0 flex items-center justify-center w-4 h-4 text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-full transition-colors"
      >
        ✕
      </button>
    </div>
  );
}
