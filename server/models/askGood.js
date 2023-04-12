const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const askGoodSchema = new Schema(
  {
    _id: { type: Number, required: true },
    _users: { type: [Object], required: false },
    goodCount: { type: Number, required: true },
  },
  {
    versionKey: false,
  }
);

askGoodSchema.set("collection", "askGood");

const AskGood = mongoose.model("askGood", askGoodSchema);

module.exports = AskGood;