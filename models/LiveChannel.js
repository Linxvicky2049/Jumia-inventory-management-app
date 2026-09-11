const mongoose = require("mongoose");

const liveChannelSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    hostName: { type: String, required: true },
    category: { type: String, default: "Jumia Live" },
    streamUrl: { type: String, default: "" },
    isLive: { type: Boolean, default: true },
    likes: { type: Number, default: 0, min: 0 },
    viewers: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LiveChannel", liveChannelSchema);