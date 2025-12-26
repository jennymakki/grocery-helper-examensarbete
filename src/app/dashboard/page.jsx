"use client";

import { useSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import AddRecipeForm from "../components/AddRecipeForm";
import RecipeCard from "../components/RecipeCard";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [recipes, setRecipes] = useState([]);
  const [loadingRecipes, setLoadingRecipes] = useState(true);

  // Redirect if not logged in
  useEffect(() => {
    if (status === "unauthenticated") {
      signIn("google");
    }
  }, [status]);

  // Fetch user recipes
  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/recipes")
        .then((res) => res.json())
        .then((data) => {
          setRecipes(data);
          setLoadingRecipes(false);
        })
        .catch(() => setLoadingRecipes(false));
    }
  }, [status]);

  if (status === "loading") {
    return <p>Loading dashboard...</p>;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">
        {session.user.image && (
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
        )}
        Welcome, {session.user.name}
      </h1>

      {/* Action buttons */}
      <div className="dashboard-actions">
        <button className="primary-btn">Add New Recipe</button>
        <button className="secondary-btn">Create Grocery List</button>
      </div>

      <AddRecipeForm onCreated={() => {
  fetch("/api/recipes")
    .then((res) => res.json())
    .then(setRecipes);
}} />

      {/* Recipes Section */}
      <section className="dashboard-section">
        <h2 className="section-title">Your Recipes</h2>

        {loadingRecipes && <p>Loading recipes...</p>}

        {!loadingRecipes && recipes.length === 0 && (
          <p>You haven’t added any recipes yet.</p>
        )}

<div className="recipe-grid">
  {recipes.map((recipe) => (
    <RecipeCard
      key={recipe._id}
      recipe={recipe}
      onChange={() => {
        fetch("/api/recipes")
          .then((res) => res.json())
          .then(setRecipes);
      }}
    />
  ))}
</div>
      </section>
    </div>
  );
}