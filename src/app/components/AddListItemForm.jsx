"use client";

import { useState } from "react";

export default function AddListItemForm({ onAdd }) {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("pcs");

  function handleAdd(e) {
    e.preventDefault();
    if (!name.trim()) return;

    onAdd({
      name: name.trim(),
      quantity: quantity.trim() || "1",
      unit,
      checked: false,
    });

    setName("");
    setQuantity("");
    setUnit("pcs");
  }

  return (
    <div className="list-card-add-item">
      <input
        className="list-card-input"
        placeholder="Ingredient"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="number"
        className="list-card-input quantity-input"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        min="0"
      />

      <select
        className="list-card-select"
        value={unit}
        onChange={(e) => setUnit(e.target.value)}
      >
        <option value="pcs">pcs</option>
        <option value="g">g</option>
        <option value="kg">kg</option>
        <option value="ml">ml</option>
        <option value="l">l</option>
      </select>

      <button type="button" className="secondary-btn add-btn" onClick={handleAdd}>
        Add
      </button>
    </div>
  );
}