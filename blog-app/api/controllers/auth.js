import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// Connect to MongoDB using mongoose
mongoose.connect("mongodb://127.0.0.1:27017/blog", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define the user schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Create a user model from the schema
const User = mongoose.model("User", userSchema);

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists in the database
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(409).json("User already exists");
    }

    // Hash the password using a secure algorithm
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user document
    const newUser = new User({ username, email, password: hashedPassword });

    // Save the new user document to the database
    await newUser.save();

    // Send a success response
    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json("Server error");
  }
};

export const login = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    if (!user) {
      return res.status(404).json("User not found!");
    }

    const isPasswordCorrect = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json("Wrong username or password!");
    }

    const token = jwt.sign({ id: user._id }, "jwtkey");
    const { password, ...other } = user.toObject(); // Convert to plain object to exclude password field

    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .json(other);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};

export const logout = (req, res) => {
  res
    .clearCookie("access_token", {
      sameSite: "none",
      secure: true,
    })
    .status(200)
    .json("User logged out");
};
