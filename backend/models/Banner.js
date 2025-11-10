const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema({
  id: Number,
  name: String,
  type: String,
  img: String,
});

module.exports = mongoose.model("Banner", bannerSchema, "banners");
