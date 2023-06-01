const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tApplicantSchema = new Schema(
  {
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    postId: { type: Number, required: true }
  },
  { versionKey: false }
);

tApplicantSchema.set("collection", "tApplicant");

const TApplicant = mongoose.model("tApplicant", tApplicantSchema);

module.exports = TApplicant;