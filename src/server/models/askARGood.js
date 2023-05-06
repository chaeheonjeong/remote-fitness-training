const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const askARGoodSchema = new Schema(
  {
    _id: { type: String, required: true },
    //clickedAReplyId : { type: Number, required: true },
    _users: { type: [Object], required: false },
    ARgoodCount: { type: Number, required: true },
  },
  {
    versionKey: false,
  }
);

askARGoodSchema.set("collection", "askARGood");

const AskARGood = mongoose.model("askARGood", askARGoodSchema);

module.exports = AskARGood;

