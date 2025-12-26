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
        items: [
          ...list.items,
          { name: newItem.trim(), checked: false },
        ],
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
      {editingTitle ? (
        <>
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
          <button onClick={saveTitle}>Save</button>
          <button onClick={() => setEditingTitle(false)}>Cancel</button>
        </>
      ) : (
        <>
          <h3>{list.title}</h3>
          <button onClick={() => setEditingTitle(true)}>Edit title</button>
        </>
      )}

      {/* Add item */}
      <div style={{ display: "flex", gap: "0.5rem", margin: "0.5rem 0" }}>
        <input
          placeholder="Add item"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addItem()}
        />
        <button onClick={addItem}>Add</button>
      </div>

      {/* Items */}
      <ul>
        {list.items.map((item, idx) => (
          <li key={idx} style={{ display: "flex", gap: "0.5rem" }}>
            <input
              type="checkbox"
              checked={item.checked}
              onChange={() => toggleItem(idx)}
            />
            <span
              style={{
                textDecoration: item.checked ? "line-through" : "none",
              }}
            >
              {item.name}
            </span>
            <button onClick={() => removeItem(idx)}>✕</button>
          </li>
        ))}
      </ul>

      <button onClick={removeList} style={{ color: "red", marginTop: "0.5rem" }}>
        Delete list
      </button>
    </div>
  );
}