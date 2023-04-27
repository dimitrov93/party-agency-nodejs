require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const { auth } = require("./middlewares/authMiddleware");
const { dbInit } = require("./config/initDB");
const { PORT } = require("./config/env.js");

const authRoute = require("./routes/auth");
const emailRoutes = require("./routes/emailRoutes");
const uploadRoutes = require("./routes/upload");
const imagesRouter = require("./routes/images");

const apiUrl =
  process.env.NODE_ENV === "production"
    ? process.env.PRODUCTION_URL
    : process.env.LOCAL_URL;

app.get("/", (req, res) => {
  res.send(`API URL: ${apiUrl}`);
});

app.use((req, res, next) => {
  console.log(`METHOD: ${req.method} >> PATH: ${req.path}`);
  next();
});

dbInit();
app.use(
  cors({
    origin: [
      "https://fairy-tale.bg",
      "https://talefairy.netlify.app",
      "http://localhost:3000",
      "http://localhost:4200",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// app.use(auth)
app.use("/", emailRoutes);
app.use("/api/auth", authRoute);
app.use("/api/images", imagesRouter);
app.use("/uploads/images", uploadRoutes);


app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
