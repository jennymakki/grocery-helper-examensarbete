"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RecipeCard from "../components/RecipeCard";
import LoadingSkeleton from "../components/LoadingSkeleton";

export default function RecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [groceryLists, setGroceryLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  // Fetch recipes and grocery lists
  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch("/api/recipes").then((res) => res.json()),
      fetch("/api/grocery-lists")
        .then((res) => res.json())
        .then((data) =>
          data.map((list) => ({
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
          }))
        ),
    ])
      .then(([recipesData, listsData]) => {
        setRecipes(recipesData);
        setGroceryLists(listsData);
      })
      .finally(() => setLoading(false));
  }, []);

  const addIngredientsToList = async (recipe, listId, newListTitle) => {
    await fetch("/api/grocery-lists/add-ingredients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipeId: recipe._id, listId, newListTitle }),
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
      <form className="filter-bar" onSubmit={(e) => e.preventDefault()}>
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
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="recipe-card">
              <LoadingSkeleton width="100%" height="8rem" />
              <LoadingSkeleton width="80%" height="1.2rem" style={{ marginTop: "0.5rem" }} />
              <LoadingSkeleton width="60%" height="1rem" style={{ marginTop: "0.25rem" }} />
            </div>
          ))
        ) : displayedRecipes.length > 0 ? (
          displayedRecipes.map((recipe) => (
            <RecipeCard
              key={recipe._id}
              recipe={recipe}
              groceryLists={groceryLists}
              onAddIngredients={addIngredientsToList}
              onChange={() => {}}
            />
          ))
        ) : (
          <p>No recipes match your search.</p>
        )}
      </div>

      {/* Back Button */}
      <div className="page-end">
        <button className="primary-btn" onClick={() => router.push("/dashboard")}>
          ← Back to Start
        </button>
      </div>
    </div>
  );
}