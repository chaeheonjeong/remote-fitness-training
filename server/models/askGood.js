const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const askGoodSchema = new Schema(
  { 
    // 좋아요 누르면 해당 글에 좋아요 누를 사람들 내역이 _users에 들어가서
    // users에 내 이름이 있으면 그걸 불러오면 됨.
    
    _id: { type: Number, required: true }, // 글 아이디
    _users: { type: [Object], required: false }, // 글 누른 사람
    goodCount: { type: Number, required: true },
  },
  {
    versionKey: false,
  }
);

askGoodSchema.set("collection", "askGood");

const AskGood = mongoose.model("askGood", askGoodSchema);

module.exports = AskGood;