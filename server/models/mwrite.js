const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const mwriteSchema = new Schema({
  _id: { type: Number, required: true }, // unique index constraint를 걸어줍니다.
  number: { type: Array, required: true },
  period: { type: Array, required: true },
  date: { type: String, required: true },
  tag: { type: Array, required: true },
  title: { type: String, required: true },
  content: { type: Object, required: true },
});

mwriteSchema.set("collection", "mwrite");

// 기존 데이터베이스의 `_id` 값을 `id` 값으로 복사합니다.
mwriteSchema.pre("save", function (next) {
  if (this.isNew) {
    this.id = this._id;
  }
  next();
});

const MWrite = mongoose.model("mwrite", mwriteSchema);

module.exports = MWrite;
