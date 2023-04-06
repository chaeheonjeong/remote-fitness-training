const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postGoodSchema = new Schema(
  {
    _id: { type: Number, required: true },
    _users: { type: [Object], required: false },
    goodCount: { type: Number, required: true },
  },
  {
    versionKey: false,
  }
);

postGoodSchema.set("collection", "postGood");

const PostGood = mongoose.model("postGood", postGoodSchema);

module.exports = PostGood;
