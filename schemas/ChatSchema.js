const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema({
    nombreChat: { type: String, trim: true },
    esChatGrupal: { type: Boolean, default: false },
    usuarios: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    ultimoMensaje: { type: Schema.Types.ObjectId, ref: 'Message' }
}, { timestamps: true });

module.exports = mongoose.model('Chat', chatSchema);