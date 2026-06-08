import { useState, useCallback, useEffect } from 'react';
import { AppLayout } from './components/layout/AppLayout';
import { ChatBar } from './components/chat/ChatBar';
import { ConsoleModal } from './components/chat/ConsoleModal';
import { RecipeGrid } from './components/recipes/RecipeGrid';
import { Watermark } from './components/ui/Watermark';
import { Toast } from './components/ui/Toast';
import { useRecipeSearch } from './hooks/useRecipeSearch';
import type { FileItem } from './types';

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [file, setFile] = useState<FileItem | null>(null);
  const [showToast, setShowToast] = useState(false);

  const {
    search,
    cancel,
    dismiss,
    isLoading,
    consoleState,
    consoleMessages,
    recipes,
  } = useRecipeSearch();

  // Show the no-results toast whenever a completed search found nothing.
  useEffect(() => {
    if (consoleState === 'success' && recipes.length === 0) {
      setShowToast(true);
    }
  }, [consoleState, recipes.length]);

  const handleSubmit = useCallback(() => {
    setShowToast(false);
    search(prompt, file);
  }, [prompt, file, search]);

  return (
    <AppLayout
      chatBar={
        <ChatBar
          prompt={prompt}
          onPromptChange={setPrompt}
          file={file}
          onFileChange={setFile}
          isLoading={isLoading}
          onSubmit={handleSubmit}
          consoleSlot={
            consoleState !== 'idle' ? (
              <ConsoleModal
                state={consoleState}
                messages={consoleMessages}
                onCancel={cancel}
                onDismiss={dismiss}
              />
            ) : undefined
          }
        />
      }
      content={
        recipes.length > 0 ? (
          <RecipeGrid recipes={recipes} />
        ) : (
          <Watermark />
        )
      }
      toast={
        showToast ? (
          <Toast
            message="No recipes found — try adding more pantry items or adjusting your notes."
            onDismiss={() => setShowToast(false)}
          />
        ) : undefined
      }
    />
  );
}

