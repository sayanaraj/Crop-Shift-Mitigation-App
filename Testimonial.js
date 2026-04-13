// models/Testimonial.js – Farmer testimonial schema
const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    initial: { type: String, required: true },   // Avatar initials, e.g. "RS"
    location: { type: String, required: true },
    crop: { type: String, required: true },
    quote: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    profitIncrease: { type: String },            // e.g. "+32%"
    approved: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Testimonial", testimonialSchema);
