"use client";

import { useState, useEffect } from "react";
import AddListItemForm from "./AddListItemForm";

export default function GroceryListCard({ list, onChange }) {
  const [expanded, setExpanded] = useState(false);

  // Local items state (UI source of truth)
  const [items, setItems] = useState([]);

  // Initialize local state ONCE per list
  useEffect(() => {
    const normalized = (list.items || []).map((item) => ({
      name: item.name || (typeof item === "string" ? item : ""),
      quantity: item.quantity || "1",
      unit: item.unit || "pcs",
      checked: item.checked || false,
    }));

    setItems(normalized);
  }, [list._id]);

  // ---------- API helper ----------
  async function updateList(data) {
    await fetch("/api/grocery-lists", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: list._id, ...data }),
    });
  }

  // ---------- Items ----------
  async function addItem(newItem) {
    const updatedItems = [...items];

    const existingIndex = updatedItems.findIndex(
      (i) =>
        i.name.toLowerCase() === newItem.name.toLowerCase() &&
        i.unit === newItem.unit
    );

    if (existingIndex > -1) {
      const existing = updatedItems[existingIndex];
      const existingQty = parseFloat(existing.quantity) || 0;
      const newQty = parseFloat(newItem.quantity) || 0;

      updatedItems[existingIndex] = {
        ...existing,
        quantity: (existingQty + newQty).toString(),
      };
    } else {
      updatedItems.push(newItem);
    }

    setItems(updatedItems);          // UI first
    await updateList({ items: updatedItems });
  }

  async function toggleItem(index) {
    const updatedItems = items.map((item, i) =>
      i === index ? { ...item, checked: !item.checked } : item
    );

    setItems(updatedItems);
    await updateList({ items: updatedItems });
  }

  async function removeItem(index) {
    const updatedItems = items.filter((_, i) => i !== index);

    setItems(updatedItems);
    await updateList({ items: updatedItems });
  }

  // ---------- Delete ----------
  async function removeList() {
    if (!confirm("Delete this grocery list?")) return;

    await fetch("/api/grocery-lists", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: list._id }),
    });

    onChange(); // parent must refetch / remove card
  }

  return (
    <div className="list-card">
      {/* Header */}
      <div className="list-card-header">
        <h3
          style={{ cursor: "pointer" }}
          onClick={() => setExpanded((prev) => !prev)}
        >
          {list.title}
        </h3>

        <div className="header-actions">
          <button
            type="button"
            className="secondary-btn"
            onClick={() => setExpanded((prev) => !prev)}
          >
            {expanded ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      {/* Items */}
      {expanded && (
        <>
          <ul className="list-card-items">
            {items.map((item, idx) => (
              <li key={idx} className="list-card-item">
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => toggleItem(idx)}
                />
                <span className={item.checked ? "checked" : ""}>
                  {item.name}
                  <span className="item-meta">
                    {item.quantity} {item.unit}
                  </span>
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

          <AddListItemForm onAdd={addItem} />

          <button
            type="button"
            className="secondary-btn remove-btn full-width"
            onClick={removeList}
          >
            Delete list
          </button>
        </>
      )}
    </div>
  );
}