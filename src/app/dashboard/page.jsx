"use client";

import { useSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import AddRecipeForm from "../components/AddRecipeForm";
import RecipeCard from "../components/RecipeCard";
import GroceryListCard from "../components/GroceryListCard";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [recipes, setRecipes] = useState([]);
  const [loadingRecipes, setLoadingRecipes] = useState(true);
  const [groceryLists, setGroceryLists] = useState([]);

  // Fetch recipes from API
  const fetchRecipes = () => {
    fetch("/api/recipes")
      .then((res) => res.json())
      .then((data) => {
        setRecipes(data);
        setLoadingRecipes(false);
      })
      .catch(() => setLoadingRecipes(false));
  };

  // Fetch grocery lists from API
  const fetchGroceryLists = () => {
    fetch("/api/grocery-lists")
      .then((res) => res.json())
      .then(setGroceryLists);
  };

  // Add item to grocery list
  const addItemToList = (listId, itemName) => {
    fetch("/api/grocery-lists", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: listId,
        items: [{ name: itemName, checked: false }],
      }),
    })
      .then((res) => res.json())
      .then((updatedList) => {
        setGroceryLists((prev) =>
          prev.map((list) => (list._id === listId ? updatedList : list))
        );
      });
  };

  // Redirect to login if unauthenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      signIn("google");
    }
  }, [status]);

  // Fetch data when authenticated
  useEffect(() => {
    if (status === "authenticated") {
      fetchRecipes();
      fetchGroceryLists();
    }
  }, [status]);

  if (status === "loading") return <p>Loading dashboard...</p>;
  if (!session) return null; // prevents flash before redirect

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

      {/* Add Recipe Form */}
      <AddRecipeForm onCreated={fetchRecipes} />

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
                fetchRecipes();
                fetchGroceryLists(); // refresh grocery lists if generated
              }}
            />
          ))}
        </div>
      </section>

      {/* Grocery Lists Section */}
      <section className="dashboard-section">
        <h2 className="section-title">Your Grocery Lists</h2>
        {groceryLists.length === 0 && <p>You haven’t created any grocery lists yet.</p>}

        <div className="list-grid">
          {groceryLists.map((list) => (
            <GroceryListCard
              key={list._id}
              list={list}
              addItem={(itemName) => addItemToList(list._id, itemName)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}