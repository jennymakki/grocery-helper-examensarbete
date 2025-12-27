"use client";

import { useState } from "react";

export default function AddRecipeForm({ onCreated }) {
  const [title, setTitle] = useState("");
  const [ingredientsList, setIngredientsList] = useState([]);
  const [newIngredient, setNewIngredient] = useState("");
  const [newQuantity, setNewQuantity] = useState("");
  const [newUnit, setNewUnit] = useState("pcs");
  const [loading, setLoading] = useState(false);

  // Add a new ingredient to the list
  function addIngredient() {
    if (!newIngredient.trim()) return;

    setIngredientsList([
      ...ingredientsList,
      {
        name: newIngredient.trim(),
        quantity: newQuantity.trim() || "1",
        unit: newUnit,
      },
    ]);

    setNewIngredient("");
    setNewQuantity("");
    setNewUnit("pcs");
  }

  // Remove an ingredient from the list
  function removeIngredient(index) {
    setIngredientsList(ingredientsList.filter((_, i) => i !== index));
  }

  // Submit recipe
  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);

    const res = await fetch("/api/recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        ingredients: ingredientsList,
      }),
    });

    setLoading(false);

    if (res.ok) {
      setTitle("");
      setIngredientsList([]);
      setNewIngredient("");
      setNewQuantity("");
      setNewUnit("pcs");
      onCreated?.();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="recipe-form">
      {/* Recipe title */}
      <div className="form-group">
        <label>Recipe Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      {/* Add ingredient */}
      <div className="form-group">
        <label>Ingredients</label>
        <div className="ingredient-row">
          <input
            type="text"
            placeholder="Ingredient"
            value={newIngredient}
            onChange={(e) => setNewIngredient(e.target.value)}
          />
          <input
            type="number"
            placeholder="Quantity"
            value={newQuantity}
            onChange={(e) => setNewQuantity(e.target.value)}
            min="0"
          />
          <select value={newUnit} onChange={(e) => setNewUnit(e.target.value)}>
            <option value="pcs">pcs</option>
            <option value="g">g</option>
            <option value="kg">kg</option>
            <option value="ml">ml</option>
            <option value="l">l</option>
          </select>
          <button type="button" onClick={addIngredient}>
            Add
          </button>
        </div>

        {/* Display added ingredients */}
        <ul className="ingredient-list">
          {ingredientsList.map((ing, idx) => (
            <li key={idx}>
              {ing.name} {ing.quantity} {ing.unit}{" "}
              <button type="button" onClick={() => removeIngredient(idx)}>
                ✕
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Submit button */}
      <button type="submit" className="primary-btn" disabled={loading}>
        {loading ? "Saving…" : "Save Recipe"}
      </button>
    </form>
  );
}