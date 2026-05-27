import type { Recipe } from '../../types';

interface RecipeCardProps {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <div className="border border-green-500 rounded-lg p-4 bg-white dark:bg-neutral-700 flex flex-col gap-3">
      <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 text-base">
        {recipe.name}
      </h3>

      <ul className="space-y-0.5">
        {recipe.ingredients.map((ingredient, i) => (
          <li key={i} className="flex gap-2 text-sm text-green-600 dark:text-green-400">
            <span aria-hidden="true" className="text-green-500 select-none">–</span>
            <span>{ingredient}</span>
          </li>
        ))}
      </ul>

      <hr className="border-neutral-200" />

      <ol className="space-y-1 list-decimal list-inside">
        {recipe.instructions.map((step, i) => (
          <li key={i} className="text-sm text-orange-500 dark:text-orange-400">
            {step}
          </li>
        ))}
      </ol>
    </div>
  );
}
