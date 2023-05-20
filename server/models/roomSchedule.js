const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roomScheduleSchema = new Schema(
  {
    userId: { type: String, required: true },
    userType: { type: String, required: true },
    roomTitle: { type: String, required: true },
    startTime: { type: String, required: true },
    date: { type: String, required: true },
  },
  {
    versionKey: false,
  }
);

roomScheduleSchema.set("collection", "roomSchedule");

const RoomSchedule = mongoose.model("RoomSchedule", roomScheduleSchema);

module.exports = RoomSchedule;
