"use client";

import { useState } from "react";
import AddListItemForm from "./AddListItemForm";

export default function CreateGroceryListForm({ onCreated }) {
  const [title, setTitle] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Add item
  function addItem(item) {
    setItems((prev) => [...prev, item]);
  }

  // Remove a single item before creating
  function removeItem(index) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  // Submit to API
  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);

    const res = await fetch("/api/grocery-lists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, items }),
    });

    setLoading(false);

    if (res.ok) {
      setTitle("");
      setItems([]);
      onCreated?.();
    }
  }

  return (
    <div className="list-card">
      {/* Title */}
      <div className="list-card-header">
        <input
          className="list-card-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Grocery List Title"
          required
        />
      </div>

      {/* Items preview */}
      {items.length > 0 && (
        <ul className="list-card-items">
          {items.map((item, idx) => (
            <li key={idx} className="list-card-item">
              {item.name}
              <span className="item-meta">
                {item.quantity} {item.unit}
              </span>
              <button
                type="button"
                className="secondary-btn remove-btn"
                onClick={() => removeItem(idx)}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Add Item */}
      <AddListItemForm onAdd={addItem} />

      {/* Action Buttons */}
      <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem", flexWrap: "wrap" }}>
        <button
          type="submit"
          className="primary-btn flex-1"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Creating…" : "Create List"}
        </button>
      </div>
    </div>
  );
}