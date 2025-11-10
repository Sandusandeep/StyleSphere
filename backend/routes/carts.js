// routes/cartRoutes.js
const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart"); // Your Mongoose model

// ✅ Fetch user's cart
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const userCart = await Cart.findOne({ userId });

    if (!userCart) {
      return res.json({ items: [] }); // Return empty cart instead of 404
    }

    res.json({ items: userCart.items });
  } catch (err) {
    console.error("Error fetching cart:", err);
    res.status(500).json({ message: "Error fetching cart" });
  }
});

// ✅ Save or update user's cart
router.post("/", async (req, res) => {
  try {
    const { userId, items } = req.body;

    let userCart = await Cart.findOne({ userId });
    if (!userCart) {
      userCart = new Cart({ userId, items });
    } else {
      userCart.items = items;
    }

    await userCart.save();
    res.json({ message: "Cart saved successfully" });
  } catch (err) {
    console.error("Error saving cart:", err);
    res.status(500).json({ message: "Error saving cart" });
  }
});

// ✅ Delete a single cart item
router.delete("/:userId/:id/:size", async (req, res) => {
  try {
    const { userId, id, size } = req.params;
    const userCart = await Cart.findOne({ userId });

    if (!userCart) return res.status(404).json({ message: "Cart not found" });

    userCart.items = userCart.items.filter(
      (item) => !(item.id === parseInt(id) && item.size === size)
    );

    await userCart.save();
    res.json({ message: "Item removed successfully" });
  } catch (err) {
    console.error("Error removing cart item:", err);
    res.status(500).json({ message: "Error removing cart item" });
  }
});

// ✅ Clear user's cart
router.delete("/clear/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    await Cart.findOneAndUpdate({ userId }, { items: [] });
    res.json({ message: "Cart cleared successfully" });
  } catch (err) {
    console.error("Error clearing cart:", err);
    res.status(500).json({ message: "Error clearing cart" });
  }
});

module.exports = router;
