const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const askSchema = new Schema(
  {
    _id : { type: Number, required: true/*, unique: true*/ }, // unique index constraint를 걸어줍니다.
    _user: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: Object, required: true },
    tag: { type: Array, required: false },
    writer: { type: String, required: true },
    writeDate: { type: String, required: true },
    views: { type: Number, required: true },
  },
  {
    versionKey: false,
  }
);

askSchema.set("collection", "ask");

const Ask = mongoose.model("ask", askSchema);

module.exports = Ask;