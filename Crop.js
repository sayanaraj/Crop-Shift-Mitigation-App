// models/Crop.js – Crop data schema (derived from crop_yield, crop_cost, msp_data CSVs)
const mongoose = require("mongoose");

const cropSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    displayName: { type: String, required: true },   // e.g. "Mustard (Oilseed)"
    category: {
      type: String,
      enum: ["oilseed", "cereal", "pulse", "cash_crop", "other"],
      required: true
    },
    season: {
      type: [String],
      enum: ["rabi", "kharif", "zaid", "whole_year"],
      required: true
    },
    msp: { type: Number, required: true },            // ₹ per quintal

    // Yield data (averaged across states from crop_yield.csv)
    avgYieldPerHectare: { type: Number },             // quintals / hectare
    avgYieldPerAcre: { type: Number },                // quintals / acre

    // Cost data (from crop_cost.csv – C2 cost)
    avgCostPerHectare: { type: Number },              // ₹ / hectare
    avgCostPerAcre: { type: Number },                 // ₹ / acre

    // Computed profit
    avgProfitPerHectare: { type: Number },
    avgProfitPerAcre: { type: Number },

    // Risk & suitability metadata
    riskLevel: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium"
    },
    waterRequirement: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium"
    },
    suitableStates: [{ type: String }],

    // Dashboard display helpers
    emoji: { type: String, default: "🌿" },
    description: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Crop", cropSchema);
