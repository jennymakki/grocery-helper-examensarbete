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
  const [ingredientsList, setIngredientsList] = useState(
    recipe.ingredients?.map((ing) =>
      typeof ing === "string"
        ? { name: ing, quantity: "1", unit: "pcs" }
        : ing
    ) || []
  );

  const [showAddToList, setShowAddToList] = useState(false);
  const [selectedList, setSelectedList] = useState("");
  const [newListTitle, setNewListTitle] = useState("");

  // Save recipe changes
  async function save() {
    await fetch("/api/recipes", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: recipe._id,
        title,
        ingredients: ingredientsList,
      }),
    });
    setEditing(false);
    onChange();
  }

  // Delete recipe
  async function remove() {
    if (!confirm("Delete this recipe?")) return;

    await fetch("/api/recipes", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: recipe._id }),
    });
    onChange();
  }

  // Add ingredients to grocery list
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

  // Add new ingredient in edit mode
  const [newIngredientName, setNewIngredientName] = useState("");
  const [newIngredientQty, setNewIngredientQty] = useState("");
  const [newIngredientUnit, setNewIngredientUnit] = useState("pcs");

  function addIngredient() {
    if (!newIngredientName.trim()) return;

    setIngredientsList([
      ...ingredientsList,
      {
        name: newIngredientName.trim(),
        quantity: newIngredientQty.trim() || "1",
        unit: newIngredientUnit,
      },
    ]);

    setNewIngredientName("");
    setNewIngredientQty("");
    setNewIngredientUnit("pcs");
  }

  // Remove ingredient in edit mode
  function removeIngredient(idx) {
    setIngredientsList(ingredientsList.filter((_, i) => i !== idx));
  }

  return (
    <div className="recipe-card">
      {editing ? (
        <div className="recipe-edit-form">
          {/* Recipe Title */}
          <input
            className="recipe-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* Ingredients List */}
          <div className="ingredient-edit-list">
            {ingredientsList.map((ing, idx) => (
              <div key={idx} className="ingredient-row">
                <input
                  value={ing.name}
                  onChange={(e) => {
                    const updated = [...ingredientsList];
                    updated[idx].name = e.target.value;
                    setIngredientsList(updated);
                  }}
                  className="recipe-input"
                />
                <input
                  type="number"
                  value={ing.quantity}
                  onChange={(e) => {
                    const updated = [...ingredientsList];
                    updated[idx].quantity = e.target.value;
                    setIngredientsList(updated);
                  }}
                  className="recipe-input quantity-input"
                  min="0"
                />
                <select
                  value={ing.unit}
                  onChange={(e) => {
                    const updated = [...ingredientsList];
                    updated[idx].unit = e.target.value;
                    setIngredientsList(updated);
                  }}
                  className="recipe-input"
                >
                  <option value="pcs">pcs</option>
                  <option value="g">g</option>
                  <option value="kg">kg</option>
                  <option value="ml">ml</option>
                  <option value="l">l</option>
                </select>
                <button type="button" onClick={() => removeIngredient(idx)}>
                  ✕
                </button>
              </div>
            ))}

            {/* Add New Ingredient */}
            <div className="ingredient-row">
  <input
    type="text"
    placeholder="Ingredient"
    value={ing.name}
    onChange={(e) => {
      const updated = [...ingredientsList];
      updated[idx].name = e.target.value;
      setIngredientsList(updated);
    }}
    className="ingredient-name-input"
  />
  <input
    type="number"
    value={ing.quantity}
    onChange={(e) => {
      const updated = [...ingredientsList];
      updated[idx].quantity = e.target.value;
      setIngredientsList(updated);
    }}
    className="ingredient-quantity-input"
    min="0"
  />
  <select
    value={ing.unit}
    onChange={(e) => {
      const updated = [...ingredientsList];
      updated[idx].unit = e.target.value;
      setIngredientsList(updated);
    }}
    className="ingredient-unit-select"
  >
    <option value="pcs">pcs</option>
    <option value="g">g</option>
    <option value="kg">kg</option>
    <option value="ml">ml</option>
    <option value="l">l</option>
  </select>
  <button type="button" onClick={() => removeIngredient(idx)} className="ingredient-remove-btn">
    ✕
  </button>
</div>
          </div>

          {/* Actions */}
          <div className="recipe-card-actions">
            <button className="primary-btn" onClick={save}>
              Save
            </button>
            <button className="secondary-btn" onClick={() => setEditing(false)}>
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
                  {ing.name} {ing.quantity} {ing.unit}
                </span>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="recipe-card-actions">
            <button className="secondary-btn" onClick={() => setEditing(true)}>
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
                disabled={
                  !selectedList || (selectedList === "new" && !newListTitle)
                }
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