"use client";

import { useState, useEffect } from "react";
import AddListItemForm from "./AddListItemForm";

export default function GroceryListCard({ list, onChange }) {
  const [editingTitle, setEditingTitle] = useState(false);
  const [title, setTitle] = useState(list.title);
  const [expanded, setExpanded] = useState(false);

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

  // Add a new item, merging duplicates
  async function addItem(newItem) {
    const updatedItems = [...items];

    // Check if item with same name & unit exists
    const existingIndex = updatedItems.findIndex(
      (i) =>
        i.name.toLowerCase() === newItem.name.toLowerCase() &&
        i.unit === newItem.unit
    );

    if (existingIndex > -1) {
      // Merge quantities
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

    // Save to API
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
          </>
        ) : (
          <>
            <h3
              style={{ cursor: "pointer" }}
              onClick={() => setExpanded((prev) => !prev)}
            >
              {title}
            </h3>

            <div className="header-actions">
              <button
                className="secondary-btn"
                onClick={() => setEditingTitle(true)}
              >
                Edit
              </button>

              <button
                className="secondary-btn"
                onClick={() => setExpanded((prev) => !prev)}
              >
                {expanded ? "Hide" : "Show"}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Items */}
      {expanded && (
        <>
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
        </>
      )}
    </div>
  );
}
