"use client";

import { useState } from "react";

export default function AddRecipeForm({ onCreated }) {
  const [title, setTitle] = useState("");
  const [ingredientsList, setIngredientsList] = useState([]);
  const [newIngredient, setNewIngredient] = useState("");
  const [newQuantity, setNewQuantity] = useState("");
  const [newUnit, setNewUnit] = useState("pcs");
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [link, setLink] = useState("");

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

  function removeIngredient(idx) {
    setIngredientsList(ingredientsList.filter((_, i) => i !== idx));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("link", link.trim());
    formData.append("ingredients", JSON.stringify(ingredientsList));
    if (imageFile) formData.append("image", imageFile);

    const res = await fetch("/api/recipes", { method: "POST", body: formData });

    setLoading(false);

    if (res.ok) {
      setTitle("");
      setIngredientsList([]);
      setImageFile(null);
      setNewIngredient("");
      setNewQuantity("");
      setNewUnit("pcs");
      setLink("");
      onCreated?.();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="recipe-form">
      {/* Title */}
      <input
        type="text"
        placeholder="Recipe Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="recipe-input full-width"
        required
      />

      {/* Link */}
      <input
        type="url"
        placeholder="Recipe Link (optional)"
        value={link}
        onChange={(e) => setLink(e.target.value)}
        className="recipe-input full-width"
      />

      {/* Image */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImageFile(e.target.files[0])}
        className="recipe-input full-width"
      />

      {/* Ingredient Row */}
      <div className="list-card-add-item">
        <input
          type="text"
          placeholder="Ingredient"
          value={newIngredient}
          onChange={(e) => setNewIngredient(e.target.value)}
          className="list-card-input"
        />
        <input
          type="number"
          placeholder="Quantity"
          value={newQuantity}
          onChange={(e) => setNewQuantity(e.target.value)}
          className="list-card-input quantity-input"
          min="0"
        />
        <select
          value={newUnit}
          onChange={(e) => setNewUnit(e.target.value)}
          className="list-card-select"
        >
          <option value="pcs">pcs</option>
          <option value="g">g</option>
          <option value="kg">kg</option>
          <option value="ml">ml</option>
          <option value="l">l</option>
        </select>
        <button
          type="button"
          className="secondary-btn add-btn"
          onClick={addIngredient}
        >
          Add
        </button>
      </div>

      {/* List of Added Ingredients */}
      <ul className="ingredient-list">
        {ingredientsList.map((ing, idx) => (
          <li key={idx} className="ingredient-item">
            <span>
              {ing.name}{" "}
              {ing.quantity !== "1" || ing.unit !== "pcs"
                ? `${ing.quantity} ${ing.unit}`
                : ""}
            </span>
            <button
              type="button"
              className="remove-btn"
              onClick={() => removeIngredient(idx)}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      {/* Submit */}
      <button type="submit" className="primary-btn" disabled={loading}>
        {loading ? "Saving…" : "Save Recipe"}
      </button>
    </form>
  );
}
