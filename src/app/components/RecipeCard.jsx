"use client";

import { useState } from "react";

export default function RecipeCard({ recipe, onChange }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(recipe.title);
  const [ingredients, setIngredients] = useState(
    recipe.ingredients?.join(", ") || ""
  );

  async function save() {
    await fetch("/api/recipes", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: recipe._id,
        title,
        ingredients: ingredients.split(",").map((i) => i.trim()),
      }),
    });

    setEditing(false);
    onChange();
  }

  async function remove() {
    if (!confirm("Delete this recipe?")) return;

    await fetch("/api/recipes", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: recipe._id }),
    });

    onChange();
  }

  if (editing) {
    return (
      <div className="recipe-card">
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
        <input
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
        />
        <button onClick={save}>Save</button>
        <button onClick={() => setEditing(false)}>Cancel</button>
      </div>
    );
  }

  return (
    <div className="recipe-card">
      <h3>{recipe.title}</h3>
      {recipe.ingredients?.length > 0 && (
        <p>{recipe.ingredients.join(", ")}</p>
      )}

      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button onClick={() => setEditing(true)}>Edit</button>
        <button onClick={remove}>Delete</button>
      </div>
    </div>
  );
}