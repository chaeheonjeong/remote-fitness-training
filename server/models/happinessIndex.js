const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const happinessIndexSchema = new Schema(
  {
    _user: { type: String, required: true },
    happinessIndex: { type: Number, required: true },
  },
  {
    versionKey: false,
  }
);

happinessIndexSchema.set("collection", "happinessIndex");

const happinessIndex = mongoose.model("happinessIndex", happinessIndexSchema);

module.exports = happinessIndex;
