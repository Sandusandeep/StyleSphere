const mongoose = require("mongoose");

const favouriteSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product", // must match your Product model name
    required: true,
  },
});

module.exports = mongoose.model("Favourite", favouriteSchema);
