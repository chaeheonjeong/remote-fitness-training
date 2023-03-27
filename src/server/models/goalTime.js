const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const goalTimeSchema = new Schema(
  {
    _user: { type: String, required: true },
    goalTime: { type: Number, required: true },
  },
  {
    versionKey: false,
  }
);

goalTimeSchema.set("collection", "goalTime");

const GoalTime = mongoose.model("goalTime", goalTimeSchema);

module.exports = GoalTime;
