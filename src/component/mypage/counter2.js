const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// counters 스키마 정의
const counter2Schema = new Schema(
  {
    name: { type: String, required: true, default: "게시물 수" },
    totalWrite: { type: Number, default: 0 },
  },
  { versionKey: false } // versionKey를 false로 지정해야 합니다.
);

counter2Schema.set("collection", "counter2");

// counters 모델 생성
const Counter2 = mongoose.model("counter2", counter2Schema);

module.exports = Counter2;