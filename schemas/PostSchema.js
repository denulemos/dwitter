const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PostSchema = new Schema({
    contenido: { type: String, trim: true },
    autor: { type: Schema.Types.ObjectId, ref: 'User' },
    pinned: Boolean,
    // likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    // redweetsUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    // redweetData: { type: Schema.Types.ObjectId, ref: 'Post' },
    // respondeA: { type: Schema.Types.ObjectId, ref: 'Post' },
    // pinned: Boolean
}, { timestamps: true });

var Post = mongoose.model('Post', PostSchema);
module.exports = Post;