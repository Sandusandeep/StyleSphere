const express = require("express");
const router = express.Router();
const Favourite = require("../models/Favourite");

// ✅ Get favourites with product details populated
router.get("/:userId", async (req, res) => {
  try {
    const favourites = await Favourite.find({
      userId: req.params.userId,
    }).populate({
      path: "productId",
      select:
        "id name type productTitle productDetails availableSizes price originalPrice images",
    });

    res.status(200).json(favourites);
  } catch (error) {
    console.error("Error fetching favourites:", error);
    res.status(500).json({ message: "Error fetching favourites" });
  }
});

// ✅ Add to favourites (avoid duplicates)
router.post("/", async (req, res) => {
  try {
    const { userId, productId } = req.body;
    if (!userId || !productId)
      return res.status(400).json({ message: "Missing userId or productId" });

    const exists = await Favourite.findOne({ userId, productId });
    if (exists)
      return res.status(400).json({ message: "Already in favourites" });

    const favourite = new Favourite({ userId, productId });
    await favourite.save();

    const populated = await favourite.populate({
      path: "productId",
      select:
        "id name type productTitle productDetails availableSizes price originalPrice images",
    });

    res.status(201).json(populated);
  } catch (error) {
    console.error("Error adding favourite:", error);
    res.status(500).json({ message: "Error adding favourite" });
  }
});

// ✅ Delete from favourites
router.delete("/:userId/:productId", async (req, res) => {
  try {
    const { userId, productId } = req.params;
    await Favourite.findOneAndDelete({ userId, productId });
    res.status(200).json({ message: "Removed from favourites" });
  } catch (error) {
    console.error("Error deleting favourite:", error);
    res.status(500).json({ message: "Error deleting favourite" });
  }
});

module.exports = router;
