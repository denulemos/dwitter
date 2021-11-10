const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const Message = require('../../schemas/MessageSchema');
const Chat = require('../../schemas/ChatSchema');
const User = require('../../schemas/UserSchema');
const Notification = require('../../schemas/NotificationSchema');

app.use(bodyParser.urlencoded({ extended: false }));

router.post("/", async (req, res, next) => {
    if (!req.body.contenido || !req.body.chatId){
        console.log("Data invalida MessagesApi");
        return res.sendStatus(400);
    }
    const newMessage = {
        emisor: req.session.user,
        contenido: req.body.contenido,
        chat: req.body.chatId
    };

    Message.create(newMessage)
    .then (async message => {
        console.log(message);
        message = await message.populate("emisor");
        message = await message.populate("chat");
        message = await User.populate(message, {path: "chat.usuarios"});

        let chat = await Chat.findByIdAndUpdate(req.body.chatId, {ultimoMensaje: message})
        .catch((e) =>{
            console.log(e);
            res.sendStatus(400);
        });
        insertNotifications(chat, message);
        res.status(201).send(message);
    })
    .catch((e) =>{
        console.log(e);
        res.sendStatus(400);
    } )
})

const insertNotifications = (chat, message) => {
    chat.usuarios.forEach(userId => {
        if (userId == message.emisor._id.toString()) return;

        Notification.insertNotification(userId, message.emisor._id, "newMessage", message.chat._id);
    });
}

module.exports = router;