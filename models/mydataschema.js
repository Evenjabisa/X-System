const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// define the Schema (structure)
const articleSchema = new Schema({
  userName: {
    type: String,
    required: true,
    trim: true
  }
});

// Create and export the model
module.exports = mongoose.model("Mydata", articleSchema);
