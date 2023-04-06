const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const scheduleSchema = new Schema({
    title: { type: String, required: true },
    date: { type: Date, required: true },
    contents: { type: String, required: true }
  });

  scheduleSchema.set("collection", "schedule");
  
  const Schedule = mongoose.model('Schedule', scheduleSchema);

  module.exports = Schedule;