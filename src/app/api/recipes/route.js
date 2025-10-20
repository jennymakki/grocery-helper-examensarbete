import connectToDatabase from "../../lib/mongodb";
import Recipe from "../../models/Recipe"; // skapa modell senare

export default async function handler(req, res) {
  await connectToDatabase();

  if (req.method === "GET") {
    const recipes = await Recipe.find({});
    res.status(200).json(recipes);
  } else if (req.method === "POST") {
    const recipe = await Recipe.create(req.body);
    res.status(201).json(recipe);
  } else {
    res.status(405).end(); // Method not allowed
  }
}