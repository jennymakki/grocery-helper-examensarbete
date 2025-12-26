import mongoose from "mongoose";

const GroceryListSchema = new mongoose.Schema(
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
    items: [
      {
        name: { type: String, required: true },
        checked: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.GroceryList ||
  mongoose.model("GroceryList", GroceryListSchema);