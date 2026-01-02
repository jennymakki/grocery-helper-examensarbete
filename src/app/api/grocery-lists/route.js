import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { dbConnect } from "@/lib/mongodb";
import GroceryList from "../../models/GroceryList";

// GET – fetch user's grocery lists
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  await dbConnect();

  const lists = await GroceryList.find({
    userId: session.user.id,
  }).sort({ createdAt: -1 });

  return Response.json(lists);
}

// POST – create list
export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const { title, items } = await req.json();
  if (!title) {
    return new Response(JSON.stringify({ error: "Title is required" }), {
      status: 400,
    });
  }

  await dbConnect();

  const newList = await GroceryList.create({
    userId: session.user.id,
    title,
    items: items || [],
  });

  return new Response(JSON.stringify(newList), { status: 201 });
}

// PUT – update items
export async function PUT(req) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { id, items } = await req.json();

  await dbConnect();

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

  await dbConnect();

  await GroceryList.deleteOne({
    _id: id,
    userId: session.user.id,
  });

  return new Response(null, { status: 204 });
}
