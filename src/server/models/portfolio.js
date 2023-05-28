const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const portfolioSchema = new Schema(
    {
        userId: {type: Schema.Types.ObjectId, ref: 'user', required:true},
        title: {type: String, required: true},
        content: {type: Object, required: true},
        writer: {type: String, required: true},
        writeDate: {type: String, rquired: true},
    },
    {
        versionKey: false,
    }
);

portfolioSchema.set("collection", "portfolio");

const Portfolio = mongoose.model("portfolio", portfolioSchema);

module.exports = Portfolio;