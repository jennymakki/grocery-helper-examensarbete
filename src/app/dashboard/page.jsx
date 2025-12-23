"use client";

import { useSession } from "next-auth/react";

export default function Dashboard() {
  const { data: session } = useSession();

  // Example saved recipes
  const recipes = [
    { id: 1, title: "Spaghetti Bolognese", image: "/recipes/spaghetti.jpg" },
    { id: 2, title: "Avocado Toast", image: "/recipes/avocado-toast.jpg" },
    { id: 3, title: "Chicken Salad", image: "/recipes/chicken-salad.jpg" },
  ];

  // Example grocery lists
  const groceryLists = [
    { id: 1, title: "Weekly Essentials" },
    { id: 2, title: "Birthday Party" },
  ];

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">
        Welcome{session?.user?.name ? `, ${session.user.name}` : ""}!
      </h1>

      {/* Action buttons */}
      <div className="dashboard-actions">
        <button className="primary-btn">Add New Recipe</button>
        <button className="secondary-btn">Create Grocery List</button>
      </div>

      {/* Recipes Section */}
      <section className="dashboard-section">
        <h2 className="section-title">Your Favorite Recipes</h2>
        <div className="recipe-grid">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="recipe-card">
              <img src={recipe.image} alt={recipe.title} />
              <h3>{recipe.title}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Grocery Lists Section */}
      <section className="dashboard-section">
        <h2 className="section-title">Your Grocery Lists</h2>
        <div className="list-grid">
          {groceryLists.map((list) => (
            <div key={list.id} className="list-card">
              <h3>{list.title}</h3>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}