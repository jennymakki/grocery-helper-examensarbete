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
      typeof ing === "string" ? { name: ing, quantity: "1", unit: "pcs" } : ing
    ) || []
  );

  const [showAddToList, setShowAddToList] = useState(false);
  const [selectedList, setSelectedList] = useState("");
  const [newListTitle, setNewListTitle] = useState("");

  // Image state
  const [newImageFile, setNewImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(recipe.image || "/recipe-placeholder.png");

  // New ingredient state
  const [newIngredientName, setNewIngredientName] = useState("");
  const [newIngredientQty, setNewIngredientQty] = useState("");
  const [newIngredientUnit, setNewIngredientUnit] = useState("pcs");

  // Save recipe changes (including image)
  async function save() {
    const formData = new FormData();
    formData.append("id", recipe._id);
    formData.append("title", title);
    formData.append("ingredients", JSON.stringify(ingredientsList));
    if (newImageFile) formData.append("image", newImageFile);

    const res = await fetch("/api/recipes", {
      method: "PUT",
      body: formData,
    });

    if (res.ok) {
      setEditing(false);
      setNewImageFile(null);
      onChange();
    } else {
      console.error("Failed to update recipe");
    }
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

  // Add new ingredient
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

  // Remove ingredient
  function removeIngredient(idx) {
    setIngredientsList(ingredientsList.filter((_, i) => i !== idx));
  }

  return (
    <div className="recipe-card">
      {editing ? (
        <div className="recipe-edit-form">
          {/* Recipe Image */}
          <div className="recipe-image-wrapper" style={{ position: "relative" }}>
            <img
              src={imagePreview}
              alt={title}
              className="recipe-image"
              loading="lazy"
            />
            <label
              htmlFor={`image-upload-${recipe._id}`}
              className="image-edit-btn"
              title="Upload new image"
            >
              Edit
              <input
                type="file"
                id={`image-upload-${recipe._id}`}
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  setNewImageFile(file);

                  // Preview immediately
                  const reader = new FileReader();
                  reader.onload = (event) => setImagePreview(event.target.result);
                  reader.readAsDataURL(file);
                }}
              />
            </label>
          </div>

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
                <button
                  type="button"
                  className="recipe-card-remove-btn"
                  onClick={() => removeIngredient(idx)}
                >
                  Remove ingredient
                </button>
              </div>
            ))}

            {/* Add New Ingredient */}
            <div className="ingredient-row">
              <input
                type="text"
                placeholder="Ingredient"
                value={newIngredientName}
                onChange={(e) => setNewIngredientName(e.target.value)}
                className="recipe-input"
              />
              <input
                type="number"
                placeholder="Quantity"
                value={newIngredientQty}
                onChange={(e) => setNewIngredientQty(e.target.value)}
                className="recipe-input quantity-input"
                min="0"
              />
              <select
                value={newIngredientUnit}
                onChange={(e) => setNewIngredientUnit(e.target.value)}
                className="recipe-input"
              >
                <option value="pcs">pcs</option>
                <option value="g">g</option>
                <option value="kg">kg</option>
                <option value="ml">ml</option>
                <option value="l">l</option>
              </select>
              <button
                type="button"
                className="recipe-card-add-btn"
                onClick={addIngredient}
              >
                Add
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
          {/* Recipe Image */}
          <div className="recipe-image-wrapper">
            <img
              src={recipe.image || "/recipe-placeholder.png"}
              alt={recipe.title}
              className="recipe-image"
              loading="lazy"
            />
          </div>

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