import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { dbConnect } from "@/lib/mongodb";
import GroceryList from "@/app/models/GroceryList";
import Recipe from "@/app/models/Recipe";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session)
    return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { recipeId, listId, newListTitle } = await req.json();
  await dbConnect();

  const recipe = await Recipe.findById(recipeId);
  if (!recipe)
    return Response.json({ error: "Recipe not found" }, { status: 404 });

  let list;

  if (listId) {
    list = await GroceryList.findOne({ _id: listId, userId: session.user.id });
    if (!list)
      return Response.json({ error: "Grocery list not found" }, { status: 404 });
  } else {
    list = await GroceryList.create({
      userId: session.user.id,
      title: newListTitle,
      items: [],
    });
  }

  for (const ingredient of recipe.ingredients) {
    const name = ingredient.name || ingredient;
    const quantity = parseFloat(ingredient.quantity || "1");
    const unit = ingredient.unit || "pcs";

    // Find if the same item+unit already exists
    const existing = list.items.find(
      (i) => i.name.toLowerCase() === name.toLowerCase() && i.unit === unit
    );

    if (existing) {
      // Merge quantities
      existing.quantity = (
        parseFloat(existing.quantity) + quantity
      ).toString();
    } else {
      // Add new item
      list.items.push({
        name,
        quantity: quantity.toString(),
        unit,
        checked: false,
      });
    }
  }

  await list.save();

  return Response.json(list);
}