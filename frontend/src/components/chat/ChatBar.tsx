import {useRef} from 'react';
import {FileChip} from './FileChip';
import {SendButton} from './SendButton';
import {ACCEPTED_FILE_TYPES} from '../../constants';
import type {FileItem} from '../../types';
import * as React from "react";

interface ChatBarProps {
  prompt: string;
  onPromptChange: (value: string) => void;
  file: FileItem | null;
  onFileChange: (file: FileItem | null) => void;
  isLoading: boolean;
  onSubmit: () => void;
}

export function ChatBar({
                          prompt,
                          onPromptChange,
                          file,
                          onFileChange,
                          isLoading,
                          onSubmit,
                        }: ChatBarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isSubmitEnabled = (prompt.trim() !== '' || file !== null) && !isLoading;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) return;
    onFileChange({id: crypto.randomUUID(), name: selected.name, file: selected});
    e.target.value = '';
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && isSubmitEnabled) {
      onSubmit();
    }
  }

  return (
      <div className="w-full px-4 pt-4 pb-3 space-y-2">
        {file && (
            <div>
              <FileChip name={file.name} onRemove={() => onFileChange(null)}/>
            </div>
        )}

        <div className="flex items-center gap-2">
          {/* Dark input bar */}
          <div className="flex-1 flex items-center bg-zinc-900 rounded-lg px-3 py-2.5 gap-2 min-w-0 border border-zinc-700 focus-within:border-green-500/50 transition-colors">
            <input
                type="text"
                value={prompt}
                onChange={(e) => onPromptChange(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
                placeholder="What do you have in your pantry"
                className="flex-1 bg-transparent text-white placeholder-neutral-500 text-sm outline-none min-w-0"
            />
            <SendButton
                isLoading={isLoading}
                disabled={!isSubmitEnabled}
                onClick={onSubmit}
            />
          </div>

          {/* Paperclip button */}
          <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              aria-label="Attach inventory file"
          className="flex items-center justify-center w-11 h-11 bg-zinc-900 rounded-lg flex-shrink-0 border border-zinc-700 hover:border-zinc-500 transition-colors"
          >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5 text-green-500"
                aria-hidden="true"
            >
              <path
                  d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
            </svg>
          </button>

          <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_FILE_TYPES}
              className="hidden"
              onChange={handleFileChange}
          />
        </div>
      </div>
  );
}
