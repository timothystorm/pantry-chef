import { useState, useCallback, useRef } from 'react';
import type { Recipe, FileItem, ConsoleEntry, ConsoleState } from '../types';
import { searchRecipes } from '../services/gemini';

/** How long the console stays visible after a successful search before auto-dismissing. */
const DISMISS_DELAY_MS = 6_000;

/** Max file size (bytes) accepted before rejecting with a user-friendly error. */
const MAX_FILE_BYTES = 512_000; // 512 KB

export interface UseRecipeSearch {
  search: (prompt: string, file: FileItem | null) => void;
  cancel: () => void;
  dismiss: () => void;
  isLoading: boolean;
  consoleState: ConsoleState;
  consoleMessages: ConsoleEntry[];
  recipes: Recipe[];
}

export function useRecipeSearch(): UseRecipeSearch {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [consoleState, setConsoleState] = useState<ConsoleState>('idle');
  const [consoleMessages, setConsoleMessages] = useState<ConsoleEntry[]>([]);

  const abortRef      = useRef<AbortController | null>(null);
  const dismissTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestIdRef  = useRef(0);

  const clearDismissTimer = useCallback(() => {
    if (dismissTimer.current !== null) {
      clearTimeout(dismissTimer.current);
      dismissTimer.current = null;
    }
  }, []);

  /** Dismiss the console without cancelling. */
  const dismiss = useCallback(() => {
    clearDismissTimer();
    setConsoleState('idle');
    setConsoleMessages([]);
  }, [clearDismissTimer]);

  /** Abort an in-flight request and immediately hide the console. */
  const cancel = useCallback(() => {
    abortRef.current?.abort();
    clearDismissTimer();
    setConsoleState('idle');
    setConsoleMessages([]);
  }, [clearDismissTimer]);

  const search = useCallback(
    async (prompt: string, file: FileItem | null) => {
      // Cancel any prior in-flight request.
      abortRef.current?.abort();
      clearDismissTimer();

      const requestId = ++requestIdRef.current;
      const controller = new AbortController();
      abortRef.current = controller;

      // Stale-request guard: only touch state if this is still the active request.
      const isActive = () => requestId === requestIdRef.current;

      const addMsg = (text: string, type: ConsoleEntry['type'] = 'info') => {
        if (!isActive()) return;
        setConsoleMessages((prev) => [
          ...prev,
          { id: crypto.randomUUID(), text, type },
        ]);
      };

      setConsoleState('loading');
      setConsoleMessages([]);
      setRecipes([]);
      addMsg('Preparing your pantry inventory…');

      try {
        let fileContent: string | null = null;

        if (file) {
          if (file.file.size > MAX_FILE_BYTES) {
            throw new Error(`File is too large (max ${MAX_FILE_BYTES / 1024} KB)`);
          }
          addMsg(`Reading "${file.name}"…`);
          fileContent = await file.file.text();
        }

        addMsg('Sending request to Gemini…');
        const results = await searchRecipes(prompt, fileContent, controller.signal);

        if (!isActive()) return;

        setRecipes(results);

        if (results.length === 0) {
          addMsg('No recipes found for those ingredients.', 'info');
        } else {
          addMsg(`✓ Found ${results.length} recipe${results.length === 1 ? '' : 's'}!`, 'success');
        }

        setConsoleState('success');

        // Auto-dismiss after delay; tied to this request's ID.
        dismissTimer.current = setTimeout(() => {
          if (isActive()) {
            setConsoleState('idle');
            setConsoleMessages([]);
          }
        }, DISMISS_DELAY_MS);
      } catch (err) {
        if (!isActive()) return;

        if (err instanceof Error && err.name === 'AbortError') {
          // cancel() already cleaned up state — nothing to do.
          return;
        }

        const message = err instanceof Error ? err.message : 'Unknown error occurred';
        addMsg(`Error: ${message}`, 'error');
        setConsoleState('error');
      }
    },
    [clearDismissTimer]
  );

  return {
    search,
    cancel,
    dismiss,
    isLoading: consoleState === 'loading',
    consoleState,
    consoleMessages,
    recipes,
  };
}
