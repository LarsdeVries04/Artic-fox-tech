const mongoose = require("mongoose");

const ArticledataSchema = new mongoose.Schema({
  ArtID: {
    type: String,
    required: true,
    immutable: true,
  },
  Aname: {
    type: String,
    required: true,
  },
  Aproducttype:{
    type: String,
    required: true,
  },
  Acategory:{
    type: String,
    required: true,
  },
  Acostprice: {
    type: Number,
    required: true,
  },
  Asaleprice: {
    type: Number,
    required: true,
  },
  Adiscount: {
    type: Number,
  },
  Astock:{
    type: Number,
    default: 0,
  },  
  Aimage: {
    type: String,
    default: "--",
  },
  Aproductdiscription:{
    type: String,
    default: "--",
  },
  Adateadded:{
    type: Date,
    default: Date.now,
    immutable: true,
  },
  Aactive: {
    type: Boolean,
    default: true
  },
});
module.exports = mongoose.model("Articledata", ArticledataSchema);
