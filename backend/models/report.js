const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  location: String,
  wasteType: String,
  severity: {
    type: String,
    enum: ["low", "medium", "high"]
  },
  status: {
    type: String,
    enum: ["pending", "resolved"],
    default: "pending"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Report", reportSchema);