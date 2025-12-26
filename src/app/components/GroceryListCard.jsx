"use client";

import { useState } from "react";

export default function GroceryListCard({ list, onChange }) {
  const [editingTitle, setEditingTitle] = useState(false);
  const [title, setTitle] = useState(list.title);
  const [newItem, setNewItem] = useState("");

  async function saveTitle() {
    await fetch("/api/grocery-lists", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: list._id, title }),
    });
    setEditingTitle(false);
    onChange();
  }

  async function addItem() {
    if (!newItem.trim()) return;

    await fetch("/api/grocery-lists", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: list._id,
        items: [...list.items, { name: newItem.trim(), checked: false }],
      }),
    });

    setNewItem("");
    onChange();
  }

  async function toggleItem(index) {
    const updatedItems = [...list.items];
    updatedItems[index].checked = !updatedItems[index].checked;

    await fetch("/api/grocery-lists", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: list._id, items: updatedItems }),
    });

    onChange();
  }

  async function removeItem(index) {
    const updatedItems = list.items.filter((_, i) => i !== index);

    await fetch("/api/grocery-lists", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: list._id, items: updatedItems }),
    });

    onChange();
  }

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
            <button className="secondary-btn" onClick={saveTitle}>Save</button>
            <button className="secondary-btn" onClick={() => setEditingTitle(false)}>Cancel</button>
          </>
        ) : (
          <>
            <h3>{list.title}</h3>
            <button className="secondary-btn" onClick={() => setEditingTitle(true)}>Edit</button>
          </>
        )}
      </div>

      {/* Add Item */}
      <div className="list-card-add-item">
  <input
    className="list-card-input"
    placeholder="Add item"
    value={newItem}
    onChange={(e) => setNewItem(e.target.value)}
    onKeyDown={(e) => e.key === "Enter" && addItem()}
  />
  <button
    type="button"
    className="primary-btn"
    onClick={addItem}
  >
    Add
  </button>
</div>

      {/* Items */}
      <ul className="list-card-items">
        {list.items.map((item, idx) => (
          <li key={idx} className="list-card-item">
            <input
              type="checkbox"
              checked={item.checked}
              onChange={() => toggleItem(idx)}
            />
            <span className={item.checked ? "checked" : ""}>{item.name}</span>
            <button className="secondary-btn remove-btn" onClick={() => removeItem(idx)}>✕</button>
          </li>
        ))}
      </ul>

      <button className="secondary-btn remove-btn full-width" onClick={removeList}>
        Delete list
      </button>
    </div>
  );
}