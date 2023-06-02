const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sApplicantSchema = new Schema(
  {
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    postId: { type: Number, required: true }
  },
  { versionKey: false }
);

sApplicantSchema.set("collection", "sApplicant");

const SApplicant = mongoose.model("sApplicant", sApplicantSchema);

module.exports = SApplicant;