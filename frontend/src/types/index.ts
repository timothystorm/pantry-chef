export interface Recipe {
  id: string;
  name: string;
  ingredients: string[];
  instructions: string[];
}

export type AppState = 'idle' | 'loading' | 'results' | 'no-results';

export interface FileItem {
  id: string;
  name: string;
  file: File;
}

export interface ToastConfig {
  message: string;
  durationMs?: number;
}

export interface ConsoleEntry {
  id: string;
  text: string;
  type: 'info' | 'success' | 'error';
}

export type ConsoleState = 'idle' | 'loading' | 'success' | 'error';
