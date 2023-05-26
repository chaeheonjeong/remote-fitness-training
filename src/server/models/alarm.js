const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const alarmSchema = new Schema(
  {
    userName: { type: String, required: true },
    _user: { type: String, required: true }, // userID
    content:  [{
      title: { type: String, required: true },
      message: { type: String, required: true },
      roomTitle: {type: String, required: true},
      createdAt: { type: Date, default: Date.now },
      read: { type: Boolean, default: false },
      role: { type: String }, // 학생일 경우에만 student라는 값 넣어주고 아니면 그냥 데이터 안 넣음.
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