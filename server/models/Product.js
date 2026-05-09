const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    isNegotiable: {
      type: Boolean,
      default: false,
    },
    category: {
      type: String,
      required: true,
      enum: ["Books", "Electronics", "Furniture", "Clothing", "Other"],
    },
    condition: {
      type: String,
      required: true,
      enum: ["New", "Like New", "Used"],
    },
    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],
    location: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Available", "Sold", "Reserved"],
      default: "Available",
    },
    isCampusOnly: {
      type: Boolean,
      default: false,
    },
    acceptsExchange: {
      type: Boolean,
      default: false,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(+new Date() + 30 * 24 * 60 * 60 * 1000), // Default 30 days
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
