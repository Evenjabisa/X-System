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
    // check validation (email & password)
    const objError = validationResult(req);
    if (objError.errors.length > 0) {
      return res.json({ arrValidationError: objError.errors });
    }

    // check if the email already exist
    const isCurrentEmail = await AuthUser.findOne({ email: req.body.email });
    if (isCurrentEmail) {
      return res.json({ existEmail: "Email already exist" });
    }

    // create new user and login
    const newUser = await AuthUser.create(req.body);
    var token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY);
    res.cookie("jwt", token, { httpOnly: true, maxAge: 86400000 });
    res.json({ id: newUser._id });
  } catch (error) {
    console.log(error);
  }
};

const post_login = async (req, res) => {
  try {
    const loginUser = await AuthUser.findOne({ email: req.body.email });

    if (loginUser == null) {
      res.json({ notFoundEmail: "Email not found, try to sign up" });
    } else {
      const match = await bcrypt.compare(req.body.password, loginUser.password);
      if (match) {
        var token = jwt.sign({ id: loginUser._id }, process.env.JWT_SECRET_KEY);
        res.cookie("jwt", token, { httpOnly: true, maxAge: 86400000 });
        res.json({ id: loginUser._id });
      } else {
        res.json({
          passwordError: `incorrect password for  ${req.body.email}`,
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};


// profile image update

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
