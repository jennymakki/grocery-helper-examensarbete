import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { connectToDatabase } from "@/app/lib/mongodb";
import GroceryList from "@/app/models/GroceryList";
import Recipe from "@/app/models/Recipe";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { recipeId, listId, newListTitle } = await req.json();
  await connectToDatabase();

  const recipe = await Recipe.findById(recipeId);
  if (!recipe) {
    return Response.json({ error: "Recipe not found" }, { status: 404 });
  }

  let list;

  if (listId) {
    list = await GroceryList.findOne({ _id: listId, userId: session.user.id });
  } else {
    list = await GroceryList.create({
      userId: session.user.id,
      title: newListTitle,
      items: [],
    });
  }

  recipe.ingredients.forEach((ingredient) => {
    if (!list.items.some((i) => i.name === ingredient)) {
      list.items.push({ name: ingredient, checked: false });
    }
  });

  await list.save();

  return Response.json(list);
}