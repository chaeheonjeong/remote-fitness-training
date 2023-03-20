const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const writeSchema = new Schema(
  {
    number: { type: Int16Array, required: true },
    period: { type: String, required: true },
    date: { type: String, required: true },
    tag: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
  },
  {
    versionKey: false,
  }
);

writeSchema.set("collection", "write");

const Write = mongoose.model("Write", writeSchema);

module.exports = Write;
