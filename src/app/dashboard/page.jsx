"use client";

import { useSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AddRecipeForm from "../components/AddRecipeForm";
import RecipeCard from "../components/RecipeCard";
import GroceryListCard from "../components/GroceryListCard";
import CreateGroceryListForm from "../components/GroceryListForm";
import LoadingSkeleton from "../components/LoadingSkeleton";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [recipes, setRecipes] = useState([]);
  const [loadingRecipes, setLoadingRecipes] = useState(true);

  const [groceryLists, setGroceryLists] = useState([]);
  const [fetchingLists, setFetchingLists] = useState(false);

  const [showAddRecipe, setShowAddRecipe] = useState(false);
  const [showCreateList, setShowCreateList] = useState(false);

  const displayedRecipes = recipes.slice(0, 6);

  const fetchRecipes = async () => {
    try {
      setLoadingRecipes(true);
      const res = await fetch("/api/recipes");
      const data = await res.json();
      setRecipes(data);
    } catch (err) {
      console.error("Failed to fetch recipes:", err);
    } finally {
      setLoadingRecipes(false);
    }
  };

  const fetchGroceryLists = async () => {
    if (fetchingLists) return;
    setFetchingLists(true);
    try {
      const res = await fetch("/api/grocery-lists");
      const data = await res.json();
      const normalized = data.map((list) => ({
        ...list,
        items: list.items.map((item) =>
          typeof item === "string"
            ? { name: item, quantity: "1", unit: "pcs", checked: false }
            : {
                name: item.name || "",
                quantity: item.quantity || "1",
                unit: item.unit || "pcs",
                checked: item.checked || false,
              }
        ),
      }));
      setGroceryLists(normalized);
    } catch (err) {
      console.error("Failed to fetch grocery lists:", err);
    } finally {
      setFetchingLists(false);
    }
  };

  const addIngredientsToList = async (recipe, listId, newListTitle) => {
    await fetch("/api/grocery-lists/add-ingredients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipeId: recipe._id, listId, newListTitle }),
    });
    fetchGroceryLists();
  };

  const addItemToList = async (listId, itemName) => {
    const res = await fetch("/api/grocery-lists", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: listId,
        items: [{ name: itemName, checked: false }],
      }),
    });
    const updatedList = await res.json();
    setGroceryLists((prev) =>
      prev.map((list) => (list._id === listId ? updatedList : list))
    );
  };

  useEffect(() => {
    if (status === "unauthenticated") signIn("google");
  }, [status]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchRecipes();
      fetchGroceryLists();
    }
  }, [status]);

  if (!session) return null;

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        {session.user.image ? (
          <img
            src={session.user.image}
            alt={session.user.name}
            className="dashboard-avatar"
          />
        ) : (
          <LoadingSkeleton
            width="3rem"
            height="3rem"
            style={{ borderRadius: "50%" }}
          />
        )}
        <h1 className="dashboard-title">
          {session.user.name || <LoadingSkeleton width="200px" height="2rem" />}
        </h1>
      </div>
      <p className="dashboard-subtitle">
        What would you like to cook or plan today?
      </p>

      {/* Action buttons */}
      <div className="dashboard-actions">
        <button
          className="primary-btn"
          onClick={() => {
            setShowAddRecipe((prev) => !prev);
            setShowCreateList(false);
          }}
        >
          {showAddRecipe ? "Close" : "Add New Recipe"}
        </button>

        <button
          className="secondary-btn"
          onClick={() => {
            setShowCreateList((prev) => !prev);
            setShowAddRecipe(false);
          }}
        >
          {showCreateList ? "Close" : "Create Grocery List"}
        </button>
      </div>

      {/* Forms */}
      {showCreateList && (
        <div className="dashboard-panel">
          <CreateGroceryListForm
            onCreated={() => {
              fetchGroceryLists();
              setShowCreateList(false);
            }}
          />
        </div>
      )}

      {showAddRecipe && (
        <div className="dashboard-panel">
          <AddRecipeForm
            onCreated={() => {
              fetchRecipes();
              setShowAddRecipe(false);
            }}
          />
        </div>
      )}

      {/* Recipes Section */}
      <section className="dashboard-section">
        <h2 className="section-title">Your Recipes</h2>

        {loadingRecipes ? (
          <div className="recipe-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="recipe-card">
                <LoadingSkeleton width="100%" height="8rem" />
                <LoadingSkeleton
                  width="80%"
                  height="1.2rem"
                  style={{ marginTop: "0.5rem" }}
                />
                <LoadingSkeleton
                  width="60%"
                  height="1rem"
                  style={{ marginTop: "0.25rem" }}
                />
              </div>
            ))}
          </div>
        ) : recipes.length === 0 ? (
          <p>You haven’t added any recipes yet.</p>
        ) : (
          <div className="recipe-grid">
            {displayedRecipes.map((recipe) => (
              <RecipeCard
                key={recipe._id}
                recipe={recipe}
                groceryLists={groceryLists}
                onAddIngredients={addIngredientsToList}
                onChange={() => {
                  fetchRecipes();
                  fetchGroceryLists();
                }}
              />
            ))}
          </div>
        )}

        {recipes.length > 6 && (
          <div className="dashboard-view-all">
            <button
              className="primary-btn"
              onClick={() => router.push("/recipes")}
            >
              View all recipes
            </button>
          </div>
        )}
      </section>

      {/* Grocery Lists Section */}
      <section className="dashboard-section">
        <h2 className="section-title">Your Grocery Lists</h2>

        {fetchingLists ? (
          <div className="list-grid">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="list-card">
                <LoadingSkeleton width="70%" height="1.5rem" />
                {Array.from({ length: 4 }).map((_, j) => (
                  <LoadingSkeleton
                    key={j}
                    width="90%"
                    height="1rem"
                    style={{ marginTop: "0.25rem" }}
                  />
                ))}
              </div>
            ))}
          </div>
        ) : groceryLists.length === 0 ? (
          <p>You haven’t created any grocery lists yet.</p>
        ) : (
          <div className="list-grid">
            {groceryLists.map((list) => (
              <GroceryListCard
                key={list._id}
                list={list}
                onChange={fetchGroceryLists}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
