const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

// Schema فرعي للـ customerInfo
const customerSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    email: String,
    phoneNumber: String,
    age: Number,
    country: String,
    gender: String,
  },
  { timestamps: true }  
);

const authUserSchema = new Schema(
  {
    profileImage: String,
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    customerInfo: [customerSchema], 
  },
  { timestamps: true } 
);

// Hash password
authUserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

const AuthUser = mongoose.model("AuthUser", authUserSchema);
module.exports = AuthUser;
