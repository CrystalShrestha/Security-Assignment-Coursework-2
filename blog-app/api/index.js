import express from "express";
import https from "https";
import fs from "fs";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import cookieParser from "cookie-parser";
import multer from "multer";

const app = express();
const PORT = 8800;

app.use(express.json());
app.use(cookieParser());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../client/public/upload");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage });

app.post("/api/upload", upload.single("file"), function (req, res) {
  const file = req.file;
  res.status(200).json(file.filename);
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

const credentials = {
  key: fs.readFileSync("server-key.pem", "utf8"),
  cert: fs.readFileSync("server-cert.pem", "utf8"),
  ca: fs.readFileSync("ca-cert.pem", "utf8"),
  passphrase: 'crystal', // Add this line with the correct passphrase
};

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(PORT, () => {
  console.log(`Server running on https://localhost:${PORT}`);
});
