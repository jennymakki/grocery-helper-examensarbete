import mongoose from "mongoose";

const RecipeSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true, // NextAuth user.id
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    image: String,
    ingredients: [String],
  },
  { timestamps: true }
);

export default mongoose.models.Recipe ||
  mongoose.model("Recipe", RecipeSchema);