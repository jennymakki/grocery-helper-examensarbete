import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: String, default: "1" },
  unit: { type: String, default: "pcs" },
  checked: { type: Boolean, default: false },
});

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
    items: [ItemSchema],
  },
  { timestamps: true }
);

export default mongoose.models.GroceryList ||
  mongoose.model("GroceryList", GroceryListSchema);