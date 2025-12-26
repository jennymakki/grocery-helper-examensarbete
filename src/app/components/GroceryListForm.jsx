"use client";

import { useState } from "react";

export default function CreateGroceryListForm({ onCreated }) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/grocery-lists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });

    setLoading(false);

    if (res.ok) {
      setTitle("");
      onCreated?.();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="recipe-form">
      <div className="form-group">
        <label>Grocery List Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="primary-btn" disabled={loading}>
        {loading ? "Creating…" : "Create List"}
      </button>
    </form>
  );
}