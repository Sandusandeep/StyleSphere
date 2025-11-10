// backend/insertUser.js
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/users";

const createUser = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");

    const name = "Sandeep";
    const email = "sandeep@example1.com";
    const password = "User@001";
    const age = 25;

    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      console.log("User already exists. Updating password...");
      existing.password = await bcrypt.hash(password, 10);
      await existing.save();
      console.log("Password updated successfully!");
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      age,
    });

    await newUser.save();
    console.log("User created successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error creating user:", err);
    process.exit(1);
  }
};

createUser();
