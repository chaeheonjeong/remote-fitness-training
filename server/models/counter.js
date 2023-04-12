const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// counters 스키마 정의
const counterSchema = new Schema(
  {
    name: { type: String, required: true, default: "게시물 수" },
    totalWrite: { type: Number, default: 0 },
  },
  { versionKey: false } // versionKey를 false로 지정해야 합니다.
);

counterSchema.set("collection", "counter");

// counters 모델 생성
const Counter = mongoose.model("counter", counterSchema);

module.exports = Counter;