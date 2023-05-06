const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const alarmSchema = new Schema(
  {
    userName: { type: String, required: true },
    content:  [{
      title: { type: String, required: true },
      message: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    }],
    _id : { type: Schema.Types.ObjectId, required: true, auto: true }, // 알림 번호

  },
  {
    versionKey: false,
  }
);

alarmSchema.set("collection", "alarm");

const Alarm = mongoose.model("alarm", alarmSchema);


module.exports = Alarm;