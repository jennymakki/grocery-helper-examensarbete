import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import cloudinary, { uploadToCloudinary } from "@/lib/cloudinary";
import { dbConnect } from "@/lib/mongodb";
import Recipe from "../../models/Recipe";
import { NextResponse } from "next/server";

export const config = {
  api: {
    bodyParser: false,
  },
};

// GET – fetch user's recipes
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  await dbConnect();

  const recipes = await Recipe.find({ userId: session.user.id }).sort({ createdAt: -1 });
  return NextResponse.json(recipes);
}

// POST – create recipe (WITH optional image)
export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();

  const formData = await req.formData(); // Web standard FormData
  const title = formData.get("title");
  const ingredients = JSON.parse(formData.get("ingredients") || "[]");
  const imageFile = formData.get("image");

  let imageUrl = "";
  if (imageFile && imageFile.size > 0) {
    imageUrl = await uploadToCloudinary(imageFile);
  }

  const recipe = await Recipe.create({
    userId: session.user.id,
    title,
    ingredients,
    image: imageUrl,
  });

  return NextResponse.json(recipe, { status: 201 });
}

// PUT – update recipe
export async function PUT(req) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  await dbConnect();

  const formData = await req.formData(); // Web FormData API
  const id = formData.get("id");
  const title = formData.get("title");
  const ingredients = JSON.parse(formData.get("ingredients") || "[]");
  const imageFile = formData.get("image");

  let imageUrl;
  if (imageFile && imageFile.size > 0) {
    imageUrl = await uploadToCloudinary(imageFile);
  }

  const updatedData = { title, ingredients };
  if (imageUrl) updatedData.image = imageUrl;

  const recipe = await Recipe.findOneAndUpdate(
    { _id: id, userId: session.user.id },
    updatedData,
    { new: true }
  );

  if (!recipe) return new Response("Not found", { status: 404 });

  return NextResponse.json(recipe);
}

// DELETE – delete recipe
export async function DELETE(req) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { id } = await req.json();
  await dbConnect();

  await Recipe.deleteOne({ _id: id, userId: session.user.id });
  return new Response(null, { status: 204 });
}