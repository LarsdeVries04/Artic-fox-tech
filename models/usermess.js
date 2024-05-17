const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  ID: {
    type: String,
  },
  Fname: {
    type: String,
    required: true,
  },
  Lname: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    lowercase: true,
    unique: true,
    required: true,
    minLength: 8,
  },
  Password: {
    type: String,
    required: true,
  },
  Postcode:{
    type: String,
    default: "--",
  },
  Address:{
    type: String,
    default: "--",
  },
  Adminrights:{
    type: Boolean,
    default: false,
  },
  dateregistered:{
    type: Date,
    default: Date.now,
    immutable: true,
  },
});
module.exports = mongoose.model("Userdata", UserSchema);
