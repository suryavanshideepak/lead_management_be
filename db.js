const mongoose = require("mongoose");
require("dotenv").config();

const mongoURI = process.env.DBHOST;

mongoose.connect(mongoURI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

module.exports = mongoose;
