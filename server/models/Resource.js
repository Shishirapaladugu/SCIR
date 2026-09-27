const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema(
  {
    resourceType: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    author: {
      type: String,
      default: "",
    },

    subject: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    academicYear: {
      type: String,
      default: "",
    },

    semester: {
      type: String,
      default: "",
    },

    institution: {
      type: String,
      required: true,
    },

    condition: {
      type: String,
      default: "",
    },

    yearsUsed: {
      type: Number,
      default: 0,
    },

    originalPrice: {
      type: Number,
      default: 0,
    },

    listingType: {
      type: String,
      enum: ["free", "sale"],
      default: "free",
    },

    expectedPrice: {
      type: Number,
      default: 0,
    },
     owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    gmail: {
      type: String,
      required: true,
    },
    

    fileName: {
      type: String,
      default: "",
    },

    filePath: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    collection: "Resource",
  },
);

module.exports = mongoose.model("Resource", resourceSchema);
