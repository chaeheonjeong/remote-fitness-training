const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const verifySchema = new Schema({
  email: { type: String, required: true },
  verify: { type: String, required: true },
  expireDate: { type: Date, required: true },
  done: { type: Boolean, default: false },
});

verifySchema.set("collection", "verify");

const Verify = mongoose.model("verify", verifySchema);

module.exports = Verify;
