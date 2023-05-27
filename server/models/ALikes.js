const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const aLikesSchema = new Schema(
    {
        _user: { type: Object, ref: 'User', required: true }, 
        aReplyId : { type: Object, ref: 'AReply', required: true },
    }
);

const ALikes = mongoose.model('ALikes', aLikesSchema);

module.exports = ALikes;