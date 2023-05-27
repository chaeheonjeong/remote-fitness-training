const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const scoreSchema = new Schema(
  {
    stars: { type: Number, required: true },
    studentName: { type: String, required: true },
<<<<<<< HEAD:src/server/models/score.js
    teacherName: { type: [String], required: true },
    writeDate: { type: String, required: true },
    roomName: { type: String, required: true },
    studentId: {type: String, required: true },
    teacherId: { type: [String], required: true },
=======
    teacherName: { type: String, required: true },
    writeDate: { type: String, required: true },
    roomName: { type: String, required: true },
    studentId: {type: String, required: true},
    teacherId: { type: String, required: true },
>>>>>>> e7b2c98a88d1d244ce132775337775fece1c43d2:server/models/score.js
    calculated: { type: Boolean, default: false },
  }
);

scoreSchema.set("collection", "score");

const Score = mongoose.model("Score", scoreSchema);
<<<<<<< HEAD:src/server/models/score.js
module.exports = Score;

const Score = mongoose.model("Score", scoreSchema);
=======
>>>>>>> e7b2c98a88d1d244ce132775337775fece1c43d2:server/models/score.js
module.exports = Score;