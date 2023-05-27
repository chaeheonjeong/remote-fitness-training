const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const happinessIndexSchema = new Schema(
  {
/*     _id: { type: Number, required: true }, // happinessIndex내에서의 user id */
    _user: { type: String, required: true },
    happinessIndex: { type: String, required: true },
  },
  {
    versionKey: false,
  }
);

happinessIndexSchema.set("collection", "happinessIndex");

const HappinessIndex = mongoose.model("happinessIndex", happinessIndexSchema);

module.exports = HappinessIndex;