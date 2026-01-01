"use client";

import { useState, useEffect } from "react";
import AddListItemForm from "./AddListItemForm";

export default function GroceryListCard({ list, onChange }) {
  const [editingTitle, setEditingTitle] = useState(false);
  const [title, setTitle] = useState(list.title);

  // Local items state for rendering & updates
  const [items, setItems] = useState([]);

  // Normalize items whenever list.items changes
  useEffect(() => {
    const normalized = (list.items || []).map((item) => ({
      name: item.name || (typeof item === "string" ? item : ""),
      quantity: item.quantity || "1",
      unit: item.unit || "pcs",
      checked: item.checked || false,
    }));
    setItems(normalized);
  }, [list.items]);

  // Save updated list title
  async function saveTitle() {
    await fetch("/api/grocery-lists", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: list._id, title }),
    });
    setEditingTitle(false);
    onChange();
  }

  // Add a new item
  async function addItem(item) {
    const updatedItems = [...items, item];
  
    await fetch("/api/grocery-lists", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: list._id, items: updatedItems }),
    });
  
    setItems(updatedItems);
    onChange();
  }

  // Toggle checked state
  async function toggleItem(index) {
    const updatedItems = [...items];
    updatedItems[index].checked = !updatedItems[index].checked;

    await fetch("/api/grocery-lists", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: list._id, items: updatedItems }),
    });

    setItems(updatedItems);
    onChange();
  }

  // Remove item
  async function removeItem(index) {
    const updatedItems = items.filter((_, i) => i !== index);

    await fetch("/api/grocery-lists", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: list._id, items: updatedItems }),
    });

    setItems(updatedItems);
    onChange();
  }

  // Delete entire list
  async function removeList() {
    if (!confirm("Delete this grocery list?")) return;

    await fetch("/api/grocery-lists", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: list._id }),
    });

    onChange();
  }

  return (
    <div className="list-card">
      {/* Title */}
      <div className="list-card-header">
        {editingTitle ? (
          <>
            <input
              className="list-card-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <button className="secondary-btn" onClick={saveTitle}>
              Save
            </button>
            <button
              className="secondary-btn"
              onClick={() => setEditingTitle(false)}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <h3>{title}</h3>
            <button
              className="secondary-btn"
              onClick={() => setEditingTitle(true)}
            >
              Edit
            </button>
          </>
        )}
      </div>

      {/* Items */}
      <ul className="list-card-items">
        {items.map((item, idx) => {
          const { name, quantity, unit, checked } = item;
          return (
            <li key={idx} className="list-card-item">
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggleItem(idx)}
              />
              <span className={checked ? "checked" : ""}>
                {name}
                <span className="item-meta">
                  {quantity} {unit}
                </span>
              </span>
              <button
                className="secondary-btn remove-btn"
                onClick={() => removeItem(idx)}
              >
                ✕
              </button>
            </li>
          );
        })}
      </ul>

      <AddListItemForm onAdd={addItem} />

      <button
        className="secondary-btn remove-btn full-width"
        onClick={removeList}
      >
        Delete list
      </button>
    </div>
  );
}
