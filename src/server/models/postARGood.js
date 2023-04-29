const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postARGoodSchema = new Schema(
  {
    _id: { type: Number, required: true },
    _users: { type: [Object], required: false },
    ARgoodCount: { type: Number, required: true },
  },
  {
    versionKey: false,
  }
);

postARGoodSchema.set("collection", "postARGood");

const PostARGood = mongoose.model("postARGood", postARGoodSchema);

module.exports = PostARGood;
