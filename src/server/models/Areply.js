const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AreplySchema = new Schema(
  {
    postId : {type: Number, required: true },
    _id : { type: Number, required: true }, 
    Arwriter: { type: String, required: true },
    _user: { type: String, required: true },
    ArwriteDate: { type: String, required: true },
    Areply: { type: String, required: true },
    /* isASecret: { type: Boolean, default: false }, */
  },
);

AreplySchema.set("collection", "Areply");

// 기존 데이터베이스의 `_id` 값을 `id` 값으로 복사합니다.
AreplySchema.pre("save", function (next) {
  if (this.isNew) {
    this.id = this._id;
  }
  next();
});

const AReply = mongoose.model("Areply", AreplySchema);

module.exports = AReply;