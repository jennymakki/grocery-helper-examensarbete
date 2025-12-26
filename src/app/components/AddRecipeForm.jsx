"use client";

import { useState } from "react";

export default function AddRecipeForm({ onCreated }) {
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        ingredients: ingredients.split(",").map((i) => i.trim()),
      }),
    });

    setLoading(false);

    if (res.ok) {
      setTitle("");
      setIngredients("");
      onCreated?.();
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
      <input
        placeholder="Recipe title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        placeholder="Ingredients (comma separated)"
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
      />
      <button disabled={loading}>
        {loading ? "Saving..." : "Add Recipe"}
      </button>
    </form>
  );
}
