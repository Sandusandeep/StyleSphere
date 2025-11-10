// backend/routes/cart.js
const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");

// ✅ Save or update cart
router.post("/", async (req, res) => {
  try {
    const { email, items, total } = req.body;
    if (!email) return res.status(400).json({ message: "Missing email" });

    let cart = await Cart.findOne({ email });
    if (cart) {
      cart.items = items;
      cart.total = total;
      await cart.save();
    } else {
      cart = new Cart({ email, items, total });
      await cart.save();
    }

    res.status(200).json({ message: "Cart saved successfully", cart });
  } catch (err) {
    console.error("Error saving cart:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ Get user's cart
router.get("/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const cart = await Cart.findOne({ email });
    if (!cart) return res.json({ items: [], total: 0 });
    res.json(cart);
  } catch (err) {
    console.error("Error fetching cart:", err);
    res
      .status(500)
      .json({ message: "Error fetching cart", error: err.message });
  }
});

// ✅ Remove single product
router.delete("/:email/:productId/:size", async (req, res) => {
  try {
    const { email, productId, size } = req.params;
    const cart = await Cart.findOne({ email });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => !(item.id.toString() === productId && item.size === size)
    );
    cart.total = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error("Error removing item:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ Clear entire cart
router.delete("/clear/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const cart = await Cart.findOne({ email });
    if (cart) {
      cart.items = [];
      cart.total = 0;
      await cart.save();
    }
    res.json({ message: "Cart cleared successfully" });
  } catch (err) {
    console.error("Error clearing cart:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
