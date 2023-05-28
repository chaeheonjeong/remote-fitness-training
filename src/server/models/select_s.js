const mogoose = require("mongoose");
const Schema = mongoose.Schema;

const select_sSchema = new Schema({
    /* 댓글 단 사람 이름 */
    applicant : { type: String, required:true },
    teacherId: { type: String, required: true },
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