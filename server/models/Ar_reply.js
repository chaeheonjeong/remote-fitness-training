const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Ar_replySchema = new Schema(
  {
    postRId : {type: Number, required: true }, //게시물 번호
    selectedARId : { type: Number, required: true }, //댓글 번호
    _id : { type: Number, required: true, auto: true }, // 대댓글 번호
    Ar_rwriter: { type: String, required: true },
    Ar_rwriteDate: { type: String, required: true },
    Ar_reply: { type: String, required: true }, // 대댓글
    isARSecret: { type: Boolean, default: false }, //대댓글비밀댓글 설정 여부
  },
  { timestamps: true }

);

Ar_replySchema.set("collection", "Ar_reply");

// 기존 데이터베이스의 `_id` 값을 `id` 값으로 복사합니다.
Ar_replySchema.pre("save", function (next) {
  if (this.isNew) {
    this.id = this._id;
  }
  next();
});

const AR_Reply = mongoose.model("Ar_reply", Ar_replySchema);
