import mongoose from "mongoose";

const IngredientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: String, default: "1" },
  unit: { type: String, default: "pcs" },
});

const RecipeSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    image: String,
    ingredients: [IngredientSchema],
  },
  { timestamps: true }
);

export default mongoose.models.Recipe ||
  mongoose.model("Recipe", RecipeSchema);