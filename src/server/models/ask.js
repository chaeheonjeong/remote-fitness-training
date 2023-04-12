const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const askSchema = new Schema(
  {
    _id : { type: Number, required: true/*, unique: true*/ }, // unique index constraint를 걸어줍니다.
    title: { type: String, required: true },
    content: { type: Object, required: true },
    tag: { type: Array, required: false },
    writer: { type: String, required: true },
    writeDate: { type: String, required: true },
    views: { type: Number, required: true },
  },
  {
    versionKey: false,
  }
);

askSchema.set("collection", "ask");

// 기존 데이터베이스의 `_id` 값을 `id` 값으로 복사합니다.
askSchema.pre("save", function (next) {
  if (this.isNew) {
    this.id = this._id;
  }
  next();
});

const Ask = mongoose.model("ask", askSchema);

module.exports = Ask;