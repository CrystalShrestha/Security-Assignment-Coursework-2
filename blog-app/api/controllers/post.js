import jwt from "jsonwebtoken";
import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/blog", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define the post schema
const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  desc: { type: String, required: true },
  img: { type: String, required: true },
  cat: { type: String, required: true },
  date: { type: Date, default: Date.now },
  uid: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

// Create a post model from the schema
const Post = mongoose.model("Post", postSchema);

export const getPosts = async (req, res) => {
  try {
    const query = req.query.cat ? { cat: req.query.cat } : {};
    const data = await Post.find(query).exec();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json(err);
  }
};

export const getPost = async (req, res) => {
  try {
    const data = await Post.findById(req.params.id)
      .populate("uid", "username img")
      .exec();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json(err);
  }
};

export const addPost = async (req, res) => {
  const { access_token: token } = req.cookies;

  if (!token) {
    return res.status(401).json("Not authenticated!");
  }

  try {
    const userInfo = jwt.verify(token, "jwtkey");

    const newPost = new Post({
      title: req.body.title,
      desc: req.body.desc,
      img: req.body.img,
      cat: req.body.cat,
      date: req.body.date,
      uid: userInfo.id,
    });

    await newPost.save();

    return res.json("Post has been created.");
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(403).json("Token is not valid!");
    }

    console.error(err);
    return res.status(500).json(err);
  }
};

export const deletePost = async (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  try {
    const userInfo = jwt.verify(token, "jwtkey");
    const postId = req.params.id;

    const result = await Post.deleteOne({ _id: postId, uid: userInfo.id });

    if (result.deletedCount === 0) {
      return res.status(403).json("You can delete only your post!");
    }

    return res.json("Post has been deleted!");
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(403).json("Token is not valid!");
    }

    console.error(err);
    return res.status(500).json(err);
  }
};

export const updatePost = async (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  try {
    const userInfo = jwt.verify(token, "jwtkey");
    const postId = req.params.id;

    const result = await Post.updateOne(
      { _id: postId, uid: userInfo.id },
      {
        title: req.body.title,
        desc: req.body.desc,
        img: req.body.img,
        cat: req.body.cat,
      }
    );

    if (result.nModified === 0) {
      return res.status(403).json("You can update only your post!");
    }

    return res.json("Post has been updated.");
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(403).json("Token is not valid!");
    }

    console.error(err);
    return res.status(500).json(err);
  }
};
