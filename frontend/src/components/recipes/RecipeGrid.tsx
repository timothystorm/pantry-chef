import { useState } from 'react';
import type { Recipe } from '../../types';
import { RecipeCard } from './RecipeCard';
import { RecipeModal } from './RecipeModal';

interface RecipeGridProps {
  recipes: Recipe[];
}

export function RecipeGrid({ recipes }: RecipeGridProps) {
  const [selected, setSelected] = useState<Recipe | null>(null);

  return (
    <>
      <div className="w-full px-4 pb-6 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} onClick={() => setSelected(recipe)} />
        ))}
      </div>

      {selected && (
        <RecipeModal recipe={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
