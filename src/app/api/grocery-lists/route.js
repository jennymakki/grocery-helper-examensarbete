import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { connectToDatabase } from "../../lib/mongodb";
import GroceryList from "../../models/GroceryList";

// GET – fetch user's grocery lists
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  await connectToDatabase();

  const lists = await GroceryList.find({
    userId: session.user.id,
  }).sort({ createdAt: -1 });

  return Response.json(lists);
}

// POST – create list
export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { title } = await req.json();
  if (!title) return new Response("Title required", { status: 400 });

  await connectToDatabase();

  const list = await GroceryList.create({
    userId: session.user.id,
    title,
    items: [],
  });

  return Response.json(list, { status: 201 });
}

// PUT – update items
export async function PUT(req) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { id, items } = await req.json();

  await connectToDatabase();

  const list = await GroceryList.findOneAndUpdate(
    { _id: id, userId: session.user.id },
    { items },
    { new: true }
  );

  if (!list) return new Response("Not found", { status: 404 });

  return Response.json(list);
}

// DELETE – delete list
export async function DELETE(req) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { id } = await req.json();

  await connectToDatabase();

  await GroceryList.deleteOne({
    _id: id,
    userId: session.user.id,
  });

  return new Response(null, { status: 204 });
}