import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { connectToDatabase } from "@/app/lib/mongodb";
import Recipe from "@/app/models/Recipe";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  await connectToDatabase();

  const recipes = await Recipe.find({
    userId: session.user.id,
  });

  return Response.json(recipes);
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const body = await req.json();
  await connectToDatabase();

  const recipe = await Recipe.create({
    userId: session.user.id,
    title: body.title,
    ingredients: body.ingredients,
  });

  return Response.json(recipe, { status: 201 });
}