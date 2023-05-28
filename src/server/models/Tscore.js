const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TscoreSchema = new Schema(
  {
    stars: { type: Number, required: true },
    studentName: { type: String, required: true },
    teacherName: { type: [String], required: true },
    writeDate: { type: String, required: true },
    roomName: { type: String, required: true },
    studentId: {type: String, required: true },
    teacherId: { type: [String], required: true },
    calculated: { type: Boolean, default: false },
    review: { type: String },
  }
);

TscoreSchema.set("collection", "Tscore");

const TScore = mongoose.model("TScore", TscoreSchema);
module.exports = TScore;