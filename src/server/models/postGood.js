const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postGoodSchema = new Schema(
  {
    _id: { type: Number, required: true },
    _users: { type: [Object], required: false },
    goodCount: { type: Number, required: true },
  },
  {
    versionKey: false,
  }
);

postGoodSchema.set("collection", "postGood");

const PostGood = mongoose.model("postGood", postGoodSchema);

<<<<<<< HEAD
module.exports = PostGood;
=======
module.exports = PostGood;
>>>>>>> e30a2c32be3ef1563102f960be9510bf239890c3
