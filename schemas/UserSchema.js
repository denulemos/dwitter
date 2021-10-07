const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    displayName: { type: String, required: true, trim: true },
    usuario: { type: String, required: true, trim: true, unique: true },
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true },
    foto: { type: String, default: "/images/profilePic.jpeg" },
    fotoPortada: { type: String },
    likes: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
    // redweets: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
    // siguiendo: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    // seguidores: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

var User = mongoose.model('User', UserSchema);
module.exports = User;