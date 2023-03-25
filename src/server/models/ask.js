const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const askSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: Object, required: true },
  }

);

askSchema.set("collection", "ask");

const Ask = mongoose.model("ask", askSchema);

module.exports = Ask;
