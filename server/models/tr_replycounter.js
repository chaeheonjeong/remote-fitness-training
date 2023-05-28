const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// counters 스키마 정의
const Tr_replycounterSchema = new Schema(
  {
    name: { type: String, required: true, default: "대댓글 수" },
    totalR_Reply: { type: Number, default: 0 },
  },
  { versionKey: false } // versionKey를 false로 지정해야 합니다.
);

Tr_replycounterSchema.set("collection", "Tr_replycounter");

// counters 모델 생성
const TR_ReplyCounter = mongoose.model("Tr_replycounter", Tr_replycounterSchema);

module.exports = TR_ReplyCounter;