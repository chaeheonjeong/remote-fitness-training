const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const writeSchema = new Schema(
  {
    _id : { type: Number, required: true}, 
    number: { type: Array, required: true },
    period: { type: Array, required: true },
    date: { type: String, required: true },
    tag: { type: Array, required: true },
    title: { type: String, required: true },
    content: { type: Object, required: true },
  }

);


writeSchema.set("collection", "write");

// 기존 데이터베이스의 `_id` 값을 `id` 값으로 복사합니다.
writeSchema.pre("save", function (next) {
  if (this.isNew) {
    this.id = this._id;
  }
  next();
});

const Write = mongoose.model("write", writeSchema);

module.exports = Write;