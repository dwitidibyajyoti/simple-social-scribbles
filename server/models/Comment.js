const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    postId: { type: String, required: true },
    text: { type: String, required: true },
    parentId: { type: Schema.Types.ObjectId, ref: 'Comment', default: null },
    labels: [{ type: String }], // Array of labels/tags
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', commentSchema);