const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
    receptor: { type: Schema.Types.ObjectId, ref: 'User' },
    emisor: { type: Schema.Types.ObjectId, ref: 'User' },
    tipoNotificacion: String,
    visto: { type: Boolean, default: false },
    entityId: Schema.Types.ObjectId
}, { timestamps: true });

NotificationSchema.statics.insertNotification = async (receptor, emisor, tipoNotificacion, entityId) => {
    var data = {
        receptor: receptor,
        emisor: emisor,
        tipoNotificacion: tipoNotificacion,
        entityId: entityId
    };
    await Notification.deleteOne(data).catch(error => console.log(error));
    return Notification.create(data).catch(error => console.log(error));
}


var Notification = mongoose.model('Notification', NotificationSchema);
module.exports = Notification;