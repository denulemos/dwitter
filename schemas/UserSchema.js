const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    usuario : {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    password : {
        type: String,
        required: true,
        trim: false,
    },
    email : {
        type: String,
        required: true,
        trim: true,
        unique: true,
    }
});