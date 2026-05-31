import '../../App.css';
import type { Recipe } from '../../types';

interface RecipeCardProps {
  recipe: Recipe;
  onClick: () => void;
}

export function RecipeCard({ recipe, onClick }: RecipeCardProps) {
  return (
    <div className="recipe-card" onClick={onClick} role="button" tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}>
      <div className="recipe-card-border-glow" />
      <div className="recipe-card-glow" />
      <div className="recipe-card-content">
        <h3 className="recipe-card-title">{recipe.name}</h3>

        <ul className="recipe-card-ingredients">
          {recipe.ingredients.map((ingredient, i) => (
            <li key={i}><span>{ingredient}</span></li>
          ))}
        </ul>

        <hr className="recipe-card-divider" />

        <ol className="recipe-card-instructions">
          {recipe.instructions.map((step, i) => (
            <li key={i}>
              <span className="step-num">{i + 1}.</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>
      <div className="recipe-card-fade" />
    </div>
  );
}
