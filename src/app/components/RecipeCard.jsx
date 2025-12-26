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

  return (
    <div className="recipe-card">
      {/* Edit Mode */}
      {editing ? (
        <div className="recipe-edit-form">
          <input
            className="recipe-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className="recipe-input"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
          />
          <div className="recipe-card-actions">
            <button className="primary-btn" onClick={save}>
              Save
            </button>
            <button
              className="secondary-btn"
              onClick={() => setEditing(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Title */}
          <h3>{recipe.title}</h3>

          {/* Ingredients Pills */}
          {recipe.ingredients?.length > 0 && (
            <div className="ingredients-pills">
              {recipe.ingredients.map((ing, idx) => (
                <span key={idx} className="pill">
                  {ing}
                </span>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="recipe-card-actions">
            <button
              className="secondary-btn"
              onClick={() => setEditing(true)}
            >
              Edit
            </button>
            <button className="secondary-btn" onClick={remove}>
              Delete
            </button>
            <button
              className="secondary-btn"
              onClick={() => setShowAddToList((v) => !v)}
            >
              Add to grocery list
            </button>
          </div>

          {/* Floating Add-to-List Panel */}
          {showAddToList && (
            <div className="add-to-list-panel">
              <select
                value={selectedList}
                onChange={(e) => setSelectedList(e.target.value)}
                className="recipe-input"
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
                  className="recipe-input"
                  placeholder="New list name"
                  value={newListTitle}
                  onChange={(e) => setNewListTitle(e.target.value)}
                />
              )}

              <button
                className="primary-btn"
                onClick={handleAddIngredients}
                disabled={!selectedList || (selectedList === "new" && !newListTitle)}
              >
                Add ingredients
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}