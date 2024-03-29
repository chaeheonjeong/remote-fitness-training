const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const writeSchema = new Schema(
  {
    _id: { type: Number, required: true /*, unique: true*/ }, // unique index constraint를 걸어줍니다.
    _user: { type: String, required: true },
    number: { type: String, required: true },
    /* period: { type: String, required: true }, */
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    runningTime: { type: String, required: true },
    estimateAmount: { type: String, required: true },
    tag: { type: Array, required: false },
    title: { type: String, required: true },
    content: { type: Object, required: true },
    writer: { type: String, required: true },
    writeDate: { type: String, required: true },
    recruit: { type: Boolean, required: true },
    views: { type: Number, required: true },
    startTime: { type: String, required: true },
  },
  {
    versionKey: false,
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