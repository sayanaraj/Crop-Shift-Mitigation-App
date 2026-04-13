// models/FPO.js – Farmer Producer Organisation schema
const mongoose = require("mongoose");

const fpoSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true },
    state: { type: String, required: true },
    contact: { type: String, required: true },
    members: { type: String, required: true },   // e.g. "1,240 Farmers"
    certification: { type: String, default: "FPO Certified ✅" },
    turnover: { type: String },                  // e.g. "₹3.2 Cr/year"
    crops: [{ type: String }],                   // ["Mustard", "Soybean"]
    email: { type: String },
    website: { type: String },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("FPO", fpoSchema);
