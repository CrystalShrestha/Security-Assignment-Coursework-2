const mongoose = require("mongoose");

const connectDB = () => {
  mongoose
    .connect("mongodb://127.0.0.1:27017/blog")
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("Could not connect to MongoDB", err));
};

module.exports = connectDB;
