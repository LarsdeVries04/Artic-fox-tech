const mongoose = require("mongoose");

const ArticlenumberSchema = new mongoose.Schema({
  ID: {
    type: String,
    unique: true,
  }
});
module.exports = mongoose.model("articlenumber", ArticlenumberSchema);
