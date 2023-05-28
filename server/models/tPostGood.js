const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tPostGoodSchema = new Schema(
  {
    _id: { type: Number, required: true },
    _users: { type: [Object], required: false },
    goodCount: { type: Number, required: true },
  },
  {
    versionKey: false,
  }
);

tPostGoodSchema.set("collection", "tPostGood");

const TPostGood = mongoose.model("tPostGood", tPostGoodSchema);

module.exports = TPostGood;
