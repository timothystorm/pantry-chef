import { useState, useCallback } from 'react';
import { AppLayout } from './components/layout/AppLayout';
import { ChatBar } from './components/chat/ChatBar';
import { RecipeGrid } from './components/recipes/RecipeGrid';
import { Watermark } from './components/ui/Watermark';
import { Toast } from './components/ui/Toast';
import type { AppState, FileItem, Recipe } from './types';

const MOCK_RECIPES: Recipe[] = [
  {
    id: '1',
    name: 'Ground Beef Stew',
    ingredients: ['Ground Beef', 'Potatoes', 'Celery', 'Onion'],
    instructions: [
      'Brown the beef in a large pot over medium-high heat',
      'Add diced vegetables and stir to combine',
      'Simmer on low for 30 minutes until tender',
      'Simmer on low for 30 minutes until tender',
      'Simmer on low for 30 minutes until tender',
    ],
  },
  {
    id: '2',
    name: 'Potato Soup',
    ingredients: ['Potatoes', 'Celery', 'Heavy Cream', 'Butter'],
    instructions: [
      'Peel and dice potatoes into 1-inch cubes',
      'Boil in salted water until fork-tender',
      'Blend with cream and butter, season to taste',
      'Blend with cream and butter, season to taste',
      'Blend with cream and butter, season to taste',
      'Blend with cream and butter, season to taste',
      'Blend with cream and butter, season to taste',
      'Blend with cream and butter, season to taste',
      'Blend with cream and butter, season to taste',
    ],
  },
  {
    id: '3',
    name: 'Stuffed Peppers',
    ingredients: ['Ground Beef', 'Bell Peppers', 'Rice', 'Tomato Sauce'],
    instructions: [
      'Mix cooked beef and rice with tomato sauce',
      'Halve peppers and remove seeds',
      'Fill peppers and bake at 375 °F for 45 min',
    ],
  },
  {
    id: '4',
    name: 'Beef Fried Rice',
    ingredients: ['Ground Beef', 'Rice', 'Soy Sauce', 'Eggs'],
    instructions: [
      'Cook rice and let it cool completely',
      'Scramble beef in a wok over high heat',
      'Add rice, soy sauce, and eggs; toss until combined',
    ],
  },
];

export default function App() {
  const [appState, setAppState] = useState<AppState>('idle');
  const [prompt, setPrompt] = useState('');
  const [file, setFile] = useState<FileItem | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = useCallback(() => {
    if (appState === 'loading') return;
    setAppState('loading');

    // Simulate AI processing — real logic added in a later phase.
    // Type "empty" or "nothing" in the prompt to demo the no-results toast.
    setTimeout(() => {
      const lower = prompt.toLowerCase();
      if (lower.includes('empty') || lower.includes('nothing')) {
        setRecipes([]);
        setAppState('no-results');
        setShowToast(true);
      } else {
        setRecipes(MOCK_RECIPES);
        setAppState('results');
      }
    }, 1500);
  }, [appState, prompt]);

  const handleDismissToast = useCallback(() => {
    setShowToast(false);
    if (appState === 'no-results') setAppState('idle');
  }, [appState]);

  return (
    <AppLayout
      chatBar={
        <ChatBar
          prompt={prompt}
          onPromptChange={setPrompt}
          file={file}
          onFileChange={setFile}
          isLoading={appState === 'loading'}
          onSubmit={handleSubmit}
        />
      }
      content={
        appState === 'results' && recipes.length > 0 ? (
          <RecipeGrid recipes={recipes} />
        ) : (
          <Watermark />
        )
      }
      toast={
        showToast ? (
          <Toast
            message="No recipes found, try adding more pantry items."
            onDismiss={handleDismissToast}
          />
        ) : undefined
      }
    />
  );
}
