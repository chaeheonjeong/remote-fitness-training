const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// selectionInfo 스키마 정의
const selectionInfoSchema = new Schema(
  {
    host: { type: String, required: true },
    applicant: { type: Array, required: true },
    roomTitle: { type: String, required: true },
    startTime: { type: String, required: true },
    date: {type:String, required: true}
  },
  { versionKey: false } // versionKey를 false로 지정해야 합니다.
);

selectionInfoSchema.set("collection", "selectionInfo");

// selectionInfo 모델 생성
const SelectionInfo = mongoose.model("selectionInfo", selectionInfoSchema);

module.exports = SelectionInfo;