const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const portfolioSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: Array, required: true },
    writer: { type: String, required: true },
    writeDate: { type: String, required: true },
  },
  {
    versionKey: false,
  }
);

portfolioSchema.set("collection", "portfolio");

const Portfolio = mongoose.model("portfolio", portfolioSchema);


module.exports = Portfolio;