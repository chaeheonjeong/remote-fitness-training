const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const studyTimeSchema = new Schema(
  {
    _user: { type: String, required: true },
    date: { type: String, required: true },
    studyTime: { type: Number, required: true },
  },
  {
    versionKey: false,
  }
);

studyTimeSchema.set("collection", "studyTime");

const StudyTime = mongoose.model("studyTime", studyTimeSchema);

module.exports = StudyTime;