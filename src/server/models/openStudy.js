const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const openStudySchema = new Schema(
  {
    img: { type: String },
    title: { type: String, required: true },
    pw: { type: Number },
    tags: { type: Array, required: true },
    personNum: { type: String, required: true },
  },
  {
    versionKey: false,
  }
);

openStudySchema.set("collection", "openStudy");

const OpenStudy = mongoose.model("OpenStudy", openStudySchema);


module.exports = OpenStudy;