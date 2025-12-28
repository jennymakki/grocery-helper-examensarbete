import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import cloudinary from "@/lib/cloudinary";
import { dbConnect } from "@/lib/mongodb";
import Recipe from "../../models/Recipe";
import { NextResponse } from "next/server";
import formidable from "formidable";

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

  const recipes = await Recipe.find({
    userId: session.user.id,
  }).sort({ createdAt: -1 });

  return NextResponse.json(recipes);
}

// POST – create recipe (WITH optional image)
export async function POST(req) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = formidable({ multiples: false });

  const { fields, files } = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });

  const title = fields.title;
  const ingredients = JSON.parse(fields.ingredients || "[]");

  let imageUrl = "";

  if (files.image) {
    const upload = await cloudinary.uploader.upload(
      files.image.filepath,
      { folder: "recipes" }
    );
    imageUrl = upload.secure_url;
  }

  const recipe = await Recipe.create({
    userId: session.user.id,
    title,
    ingredients,
    image: imageUrl,
  });

  return NextResponse.json(recipe, { status: 201 });
}

// PUT – update recipe (no image update yet)
export async function PUT(req) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { id, title, ingredients } = await req.json();

  await dbConnect();

  const recipe = await Recipe.findOneAndUpdate(
    { _id: id, userId: session.user.id },
    { title, ingredients },
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

  await Recipe.deleteOne({
    _id: id,
    userId: session.user.id,
  });

  return new Response(null, { status: 204 });
}