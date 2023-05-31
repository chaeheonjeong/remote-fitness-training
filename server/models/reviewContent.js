const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// counters 스키마 정의
const reviewContentSchema = new Schema(
  {
    _user: { type: String, required: true },
    reviewContents: { type: Array, required: true },
  },
  { versionKey: false } // versionKey를 false로 지정해야 합니다.
);

reviewContentSchema.set("collection", "reviewContent");

// counters 모델 생성
const ReviewContent = mongoose.model("reviewContent", reviewContentSchema);

module.exports = ReviewContent;
