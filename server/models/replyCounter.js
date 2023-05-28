const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// counters 스키마 정의
const replycounterSchema = new Schema(
  {
    name: { type: String, required: true, default: "게시물 수" },
    totalReply: { type: Number, default: 0 },
  },
  { versionKey: false } // versionKey를 false로 지정해야 합니다.
);

replycounterSchema.set("collection", "replycounter");

// counters 모델 생성
const ReplyCounter = mongoose.model("replycounter", replycounterSchema);

module.exports = ReplyCounter;
