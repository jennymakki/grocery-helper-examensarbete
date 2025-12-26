"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function Dashboard() {
  const { data: session, status } = useSession();

  // Redirect if not logged in
  useEffect(() => {
    if (status === "unauthenticated") {
      signIn("google");
    }
  }, [status]);

  if (status === "loading") {
    return <p>Loading dashboard...</p>;
  }

  if (!session) {
    return null; // prevents flash before redirect
  }

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
<img
  src={session.user.image}
  alt={session.user.name}
  style={{
    width: 64,
    height: 64,
    borderRadius: "50%",
    marginBottom: "1rem",
  }}
/>
  Welcome, {session.user.name}
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