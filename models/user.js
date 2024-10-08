const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  bio: {
    type: String,  
  },
  social_links: {
  type: String,
  },
  experience: {
    type:String,
  },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review'}],
  sampleMixes:[String],
});

const User = mongoose.model("User", userSchema);
module.exports = User;
