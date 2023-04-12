const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    image: { type: String },
    /* userLikedStudy: [{ type: Schema.Types.ObjectId, ref: 'Study' }] */
  },
  {
    versionKey: false,
  }
);

userSchema.set("collection", "user");

const User = mongoose.model("User", userSchema);

module.exports = User;

