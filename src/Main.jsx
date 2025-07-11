import React from "react";
import { getRecipeFromMistral } from "./api";
import ReactMarkdown from "react-markdown";

export default function Main() {
  const [ingredients, setIngredients] = React.useState([]);
  const [recipe, setRecipe] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [toast, setToast] = React.useState(null);

  // Toast auto-dismiss
  React.useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  function showToast(msg) {
    setToast(msg);
  }

  function addIngredient(formData) {
    const newIngredient = formData.get("ingredient");
    setIngredients((prevIngredients) => [...prevIngredients, newIngredient]);
    showToast(`Added: ${newIngredient}`);
  }

  function removeIngredient(ingredient) {
    setIngredients((prev) => prev.filter((i) => i !== ingredient));
    showToast(`Removed: ${ingredient}`);
  }

  function clearIngredients() {
    setIngredients([]);
    showToast("Cleared all ingredients");
  }

  async function handleGetRecipe() {
    setLoading(true);
    setRecipe("");
    const result = await getRecipeFromMistral(ingredients);
    setRecipe(result);
    setLoading(false);
    showToast("Recipe generated!");
  }

  function handleCopyRecipe() {
    if (recipe) {
      navigator.clipboard.writeText(recipe);
      showToast("Recipe copied!");
    }
  }

  return (
    <main className="main-grid">
      {toast && <div className="toast" role="status">{toast}</div>}
      <section className="card ingredients-card">
        <form action={addIngredient} className="add-form">
          <input
            type="text"
            placeholder="E.g. oregano"
            aria-label="Add ingredient"
            name="ingredient"
            autoComplete="off"
          />
          <button type="submit">Add ingredient</button>
        </form>
        <div className="ingredients-header-row">
          <h2>Ingredients on hand</h2>
          {ingredients.length > 0 && (
            <button className="clear-btn" onClick={clearIngredients} title="Clear all ingredients">Clear all</button>
          )}
        </div>
        <ul className="ingredients-list" aria-live="polite">
          {ingredients.map((ingredient) => (
            <li key={ingredient} className="ingredient-item">
              <span>{ingredient}</span>
              <button
                className="remove-btn"
                title={`Remove ${ingredient}`}
                onClick={() => removeIngredient(ingredient)}
                aria-label={`Remove ${ingredient}`}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      </section>
      <section className="card recipe-card">
        <div className="get-recipe-container">
          <div>
            <h3>Ready for a recipe?</h3>
            <p>Generate a recipe from your list of ingredients.</p>
          </div>
          <button onClick={handleGetRecipe} disabled={loading || ingredients.length < 2}>
            {loading ? "Generating..." : "Get a recipe"}
          </button>
        </div>
        {recipe && (
          <div className="recipe-output">
            <div className="recipe-header-row">
              <h3>Your Recipe</h3>
              <button className="copy-btn" onClick={handleCopyRecipe} title="Copy recipe to clipboard">Copy</button>
            </div>
            <ReactMarkdown>{recipe}</ReactMarkdown>
          </div>
        )}
      </section>
    </main>
  );
}
