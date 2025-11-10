import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
      id: { type: Number, required: true },
      name: String,
      productTitle: String,
      size: { type: String, default: "M" },
      quantity: { type: Number, default: 1 },
      price: Number,
      originalPrice: Number,
      images: [String],
    }],
    total: { type: Number, default: 0 }
  },
  { timestamps: true }
);

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
