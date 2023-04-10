const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const replySchema = new Schema(
  {
    postId : {type: Number, required: true },
    _id : { type: Number, required: true }, 
    //rwriter: { type: String, required: true },
    //rwriteDate: { type: String, required: true },
    reply: { type: String, required: true },
    isSecret: { type: Boolean, default: false },
  },
  { timestamps: true }

);

replySchema.set("collection", "reply");

// 기존 데이터베이스의 `_id` 값을 `id` 값으로 복사합니다.
replySchema.pre("save", function (next) {
  if (this.isNew) {
    this.id = this._id;
  }
  next();
});

const Reply = mongoose.model("reply", replySchema);

module.exports = Reply;