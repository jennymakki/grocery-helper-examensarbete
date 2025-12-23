import connectToDatabase from "../../lib/mongodb";
import Recipe from "../../models/Recipe"; // skapa modell senare

export async function GET() {
  return new Response(
    JSON.stringify({ message: "Recipes API not implemented yet" }),
    { status: 200 }
  );
}