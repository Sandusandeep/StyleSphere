const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  id: Number,
  name: String,
  type: String,
  productTitle: String,
  productDetails: Object,
  availableSizes: [String],
  price: Number,
  originalPrice: Number,
  images: [String],
});

module.exports = mongoose.model("Product", productSchema, "products");
