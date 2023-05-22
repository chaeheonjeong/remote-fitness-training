const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const scoreSchema = new Schema(
  {
    _user: { type: String},
    stars: { type: Number, required: true },
    swriter: { type: String, required: true },
    swriteDate: { type: String, required: true },
    roomName: { type: String, required: true },
    userId: {type: String, required: true},
    calculated: { type: Boolean, default: false },

  }
);

scoreSchema.set("collection", "score");

const Score = mongoose.model("Score", scoreSchema);
module.exports = Score;
