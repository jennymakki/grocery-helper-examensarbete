"use client";

export default function GroceryListCard({ list }) {
  return (
    <div className="list-card">
      <h3>{list.title}</h3>
      <p>{list.items.length} items</p>
    </div>
  );
}