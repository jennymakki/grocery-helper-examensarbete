"use client";

import { useState } from "react";

export default function RecipeCard({
  recipe,
  groceryLists,
  onAddIngredients,
  onChange,
}) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(recipe.title);
  const [ingredients, setIngredients] = useState(
    recipe.ingredients?.join(", ") || ""
  );

  const [showAddToList, setShowAddToList] = useState(false);
  const [selectedList, setSelectedList] = useState("");
  const [newListTitle, setNewListTitle] = useState("");

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

  const handleAddIngredients = async () => {
    await onAddIngredients(
      recipe,
      selectedList !== "new" ? selectedList : null,
      newListTitle
    );

    setShowAddToList(false);
    setSelectedList("");
    setNewListTitle("");
  };

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

      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <button onClick={() => setEditing(true)}>Edit</button>
        <button onClick={remove}>Delete</button>
        <button onClick={() => setShowAddToList((v) => !v)}>
          Add ingredients to grocery list
        </button>
      </div>

      {showAddToList && (
        <div className="add-to-list" style={{ marginTop: "0.75rem" }}>
          <select
            value={selectedList}
            onChange={(e) => setSelectedList(e.target.value)}
          >
            <option value="">Select list</option>
            {groceryLists.map((list) => (
              <option key={list._id} value={list._id}>
                {list.title}
              </option>
            ))}
            <option value="new">➕ Create new list</option>
          </select>

          {selectedList === "new" && (
            <input
              placeholder="New list name"
              value={newListTitle}
              onChange={(e) => setNewListTitle(e.target.value)}
            />
          )}

          <button
            onClick={handleAddIngredients}
            disabled={
              !selectedList ||
              (selectedList === "new" && !newListTitle)
            }
          >
            Add ingredients
          </button>
        </div>
      )}
    </div>
  );
}