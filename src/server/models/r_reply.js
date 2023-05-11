const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const r_replySchema = new Schema(
  {
    postRId : {type: Number, required: true }, //게시물 번호
    selectedRId : { type: Number, required: true }, //댓글 번호
    _id : { type: Number, required: true, auto: true }, // 대댓글 번호
    r_rwriter: { type: String, required: true },
    _user: { type: String, required: true },
    r_rwriteDate: { type: String, required: true },
    r_reply: { type: String, required: true }, // 대댓글
    //isRSecret: { type: Boolean, default: false }, //대댓글비밀댓글 설정 여부
  },
  { timestamps: true }

);

r_replySchema.set("collection", "r_reply");

// 기존 데이터베이스의 `_id` 값을 `id` 값으로 복사합니다.
r_replySchema.pre("save", function (next) {
  if (this.isNew) {
    this.id = this._id;
  }
  next();
});

const R_Reply = mongoose.model("r_reply", r_replySchema);

module.exports = R_Reply;