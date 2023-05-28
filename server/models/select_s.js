<<<<<<< HEAD:src/server/models/select_s.js
const mogoose = require("mongoose");
const Schema = mongoose.Schema;

const select_sSchema = new Schema({
    /* 댓글 단 사람 이름 */
    applicant : { type: String, required:true },
    teacherId: { type: String, required: true },
=======
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const select_sSchema = new Schema({
  /* 댓글 단 사람 이름 */
  applicant: { type: String, required: true },
>>>>>>> fc3dde5b43cb337e82f771769daad32e1f1ae3c2:server/models/select_s.js
});

/* select_sSchema.set("collection", "select_s");

const Select_s = mongoose.model("select_s", select_sSchema);

const reply = mongoose.model("reply", new Schema({}));
const r_reply = mongoose.model("r_reply", new Schema({}));

(async () => {
    const distinctReply = await reply.distinct("rwriter");
    const distinctR_Reply = await r_reply.distinct("r_rwriter");

    const replyWriters = [...new Set([...distinctReply, ...distinctR_Reply])];

    const applicant = replyWriter.map((nickname) => ({
        applicant: nickname,
    }));
}) */
select_sSchema.set("collection", "select_s");

const Select_s = mongoose.model("select_s", select_sSchema);

module.exports = Select_s;
