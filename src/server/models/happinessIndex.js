const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const happinessIndexSchema = new Schema(
  {
<<<<<<< HEAD:src/server/models/happinessIndex.js
/*     _id: { type: Number, required: true }, // happinessIndex내에서의 user id */
=======
    /*     _id: { type: Number, required: true }, // happinessIndex내에서의 user id */
>>>>>>> e7b2c98a88d1d244ce132775337775fece1c43d2:server/models/happinessIndex.js
    _user: { type: String, required: true },
    happinessIndex: { type: String, required: true },
  },
  {
    versionKey: false,
  }
);

happinessIndexSchema.set("collection", "happinessIndex");

const HappinessIndex = mongoose.model("happinessIndex", happinessIndexSchema);

<<<<<<< HEAD:src/server/models/happinessIndex.js
module.exports = HappinessIndex;
=======
module.exports = HappinessIndex;
>>>>>>> e7b2c98a88d1d244ce132775337775fece1c43d2:server/models/happinessIndex.js
