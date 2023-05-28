const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// counters 스키마 정의
const Ar_replycounterSchema = new Schema(
  {
    name: { type: String, required: true, default: "대댓글 수" },
    totalR_Reply: { type: Number, default: 0 },
  },
  { versionKey: false } // versionKey를 false로 지정해야 합니다.
);

Ar_replycounterSchema.set("collection", "Ar_replycounter");

// counters 모델 생성
const AR_ReplyCounter = mongoose.model(
  "Ar_replycounter",
  Ar_replycounterSchema
);

module.exports = AR_ReplyCounter;
