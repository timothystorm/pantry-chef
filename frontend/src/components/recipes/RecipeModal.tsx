import { useEffect } from 'react';
import '../../App.css';
import type { Recipe } from '../../types';

interface RecipeModalProps {
  recipe: Recipe;
  onClose: () => void;
}

export function RecipeModal({ recipe, onClose }: RecipeModalProps) {
  // Close on Escape key
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // Prevent body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div
      className="recipe-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={recipe.name}
    >
      {/* Stop clicks inside the modal from closing it */}
      <div className="recipe-modal" onClick={(e) => e.stopPropagation()}>
        <div className="recipe-modal-bar" aria-hidden="true" />

        <button
          type="button"
          className="recipe-modal-close"
          onClick={onClose}
          aria-label="Close recipe"
        >
          ✕
        </button>

        {/* overflow-y: auto lives on .recipe-modal-body */}
        <div className="recipe-modal-body">
          <h2 className="recipe-modal-title">{recipe.name}</h2>

          <section>
            <p className="recipe-modal-section-label">Ingredients</p>
            <ul className="recipe-modal-ingredients">
              {recipe.ingredients.map((ingredient, i) => (
                <li key={i}>{ingredient}</li>
              ))}
            </ul>
          </section>

          <hr className="recipe-modal-divider" />

          <section>
            <p className="recipe-modal-section-label">Instructions</p>
            <ol className="recipe-modal-instructions">
              {recipe.instructions.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
}
