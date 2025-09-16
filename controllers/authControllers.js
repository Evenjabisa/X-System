const AuthUser = require("../models/authUser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
require("dotenv").config();

// ================== Cloudinary & Multer ==================
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "user_profiles",
    allowed_formats: ["jpg", "png", "jpeg"],
    public_id: (req, file) =>
      Date.now() + "-" + file.originalname.replace(/\s+/g, "_"),
  },
});

const upload = multer({ storage });

// ================== Helper ==================
const createToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "1d" }
  );
};



// ================== Controllers ==================
const get_Welcome = (req, res) => {
  res.render("welcome");
};

const get_signout = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};

const get_login = (req, res) => {
  res.render("auth/login");
};

const get_signup = (req, res) => {
  res.render("auth/signup");
};

const post_signup = async (req, res) => {
  try {
    const objError = validationResult(req);
    if (!objError.isEmpty()) {
      return res.status(400).json({ errors: objError.array() });
    }

    const isCurrentEmail = await AuthUser.findOne({ email: req.body.email });
    if (isCurrentEmail) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // 🔒 Hash password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newUser = await AuthUser.create({
      ...req.body,
      password: hashedPassword,
    });

    const token = createToken(newUser);

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 86400000,
    });

    res.json({ id: newUser._id });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const post_login = async (req, res) => {
  try {
    const loginUser = await AuthUser.findOne({ email: req.body.email });
    if (!loginUser) {
      return res.status(400).json({ error: "Email not found, please signup" });
    }

    const match = await bcrypt.compare(req.body.password, loginUser.password);
    if (!match) {
      return res.status(400).json({ error: "Incorrect password" });
    }

    const token = createToken(loginUser);

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 86400000,
    });

    res.json({ id: loginUser._id });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const profile_image_update = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY);

    // Cloudinary بيخزن رابط آمن في secure_url
    const imageUrl = req.file.path || req.file.secure_url;

    const updatedUser = await AuthUser.findByIdAndUpdate(
      decoded.id,
      { profileImage: imageUrl },
      { new: true }
    );

    console.log("Uploaded file:", req.file);

    return res.redirect("/home");
  } catch (err) {
    console.error("Error updating profile:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  get_Welcome,
  get_signout,
  get_login,
  get_signup,
  post_signup,
  post_login,
  profile_image_update,
  upload,
};
