const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// counters 스키마 정의
const r_replycounterSchema = new Schema(
  {
    name: { type: String, required: true, default: "대댓글 수" },
    totalR_Reply: { type: Number, default: 0 },
  },
  { versionKey: false } // versionKey를 false로 지정해야 합니다.
);

r_replycounterSchema.set("collection", "r_replycounter");

// counters 모델 생성
const R_ReplyCounter = mongoose.model("r_replycounter", r_replycounterSchema);

module.exports = R_ReplyCounter;