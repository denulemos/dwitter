const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    emisor: { type: Schema.Types.ObjectId, ref: 'User' },
    contenido: { type: String, trim: true },
    chat: { type: Schema.Types.ObjectId, ref: 'Chat' },
    leidoPor: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);