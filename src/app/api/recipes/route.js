import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { connectToDatabase } from "../../lib/mongodb";
import Recipe from "../../models/Recipe";

// GET – fetch logged-in user's recipes
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  await connectToDatabase();

  const recipes = await Recipe.find({
    userId: session.user.id,
  }).sort({ createdAt: -1 });

  return Response.json(recipes);
}

// POST – create recipe
export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { title, ingredients } = await req.json();
  if (!title) return new Response("Title required", { status: 400 });

  await connectToDatabase();

  const recipe = await Recipe.create({
    userId: session.user.id,
    title,
    ingredients,
  });

  return Response.json(recipe, { status: 201 });
}

// PUT – update recipe
export async function PUT(req) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { id, title, ingredients } = await req.json();

  await connectToDatabase();

  const recipe = await Recipe.findOneAndUpdate(
    { _id: id, userId: session.user.id },
    { title, ingredients },
    { new: true }
  );

  if (!recipe) return new Response("Not found", { status: 404 });

  return Response.json(recipe);
}

// DELETE – delete recipe
export async function DELETE(req) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { id } = await req.json();

  await connectToDatabase();

  await Recipe.deleteOne({
    _id: id,
    userId: session.user.id,
  });

  return new Response(null, { status: 204 });
}