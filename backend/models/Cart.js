// backend/models/Cart.js
const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    items: [
      {
        id: Number,
        name: String,
        productTitle: String,
        price: Number,
        originalPrice: Number,
        images: [String],
        size: String,
        quantity: Number,
      },
    ],
    total: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
