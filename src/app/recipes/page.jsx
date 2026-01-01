"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RecipeCard from "../components/RecipeCard";

export default function RecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [groceryLists, setGroceryLists] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  // Fetch recipes
  useEffect(() => {
    fetch("/api/recipes")
      .then((res) => res.json())
      .then(setRecipes);
  }, []);

  // Fetch grocery lists
  useEffect(() => {
    fetch("/api/grocery-lists")
      .then((res) => res.json())
      .then((data) => {
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
      });
  }, []);

  const addIngredientsToList = async (recipe, listId, newListTitle) => {
    await fetch("/api/grocery-lists/add-ingredients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipeId: recipe._id,
        listId,
        newListTitle,
      }),
    });

    // Refresh lists
    fetch("/api/grocery-lists")
      .then((res) => res.json())
      .then(setGroceryLists);
  };

  const displayedRecipes = recipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="recipes-page-container">
      <h1 className="section-title">All Recipes</h1>

      {/* Search bar */}
      <form
        className="filter-bar"
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          type="text"
          placeholder="Search recipes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <button type="submit" className="primary-btn">
          Search
        </button>
      </form>

      {/* Recipe Grid */}
      <div className="recipe-page-grid">
        {displayedRecipes.map((recipe) => (
          <RecipeCard
            key={recipe._id}
            recipe={recipe}
            groceryLists={groceryLists}
            onAddIngredients={addIngredientsToList}
            onChange={() => {}}
          />
        ))}
        {displayedRecipes.length === 0 && (
          <p>No recipes match your search.</p>
        )}
      </div>

      {/* Back Button */}
      <div className="page-end">
        <button
          className="primary-btn"
          onClick={() => router.push("/dashboard")}
        >
          ← Back to Start
        </button>
      </div>
    </div>
  );
}