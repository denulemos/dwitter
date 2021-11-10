const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const User = require('../../schemas/UserSchema');
const Post = require('../../schemas/PostSchema');
const Chat = require('../../schemas/ChatSchema');
const Messages = require('../../schemas/MessageSchema');

app.use(bodyParser.urlencoded({ extended: false }));

router.post("/", async (req, res, next) => {
    if(!req.body.usuarios) {
        return res.sendStatus(400);
    }

    const users = JSON.parse(req.body.usuarios);

    if(!users.length) {
        return res.sendStatus(400);
    }

    users.push(req.session.user);

    const chatData = {
        usuarios: users,
        esChatGrupal: true
    };

    Chat.create(chatData)
    .then(results => res.status(200).send(results))
    .catch(error => {
        console.log(error);
        return res.sendStatus(400);
    })
})

router.get("/", async (req, res, next) => {
    Chat.find({usuarios: { $elemMatch: {$eq: req.session.user._id}}})
    .populate("usuarios")
    .populate("ultimoMensaje")
    .sort({updatedAt: -1}) // Ordenar los chats por mas recientes
    .then(async results => {
        if (req.query.unreadOnly && req.query.unreadOnly == "true"){
            results = results.filter(r => r.ultimoMensaje && !r.ultimoMensaje.leidoPor.includes(req.session.user._id))
        }

        results = await User.populate(results, {path: "ultimoMensaje.emisor"});
        res.status(200).send(results);})
    .catch(e =>console.log(e));
})

router.get("/:chatId", async (req, res, next) => {
    Chat.findOne({_id: req.params.chatId, usuarios: { $elemMatch: {$eq: req.session.user._id}}})
    .populate("usuarios")
    .then(results => res.status(200).send(results))
    .catch(e => res.sendStatus(400));
})

router.get("/:chatId/messages", async (req, res, next) => {
    Messages.find({chat: req.params.chatId})
    .populate("emisor")
    .then(results => res.status(200).send(results))
    .catch(e => res.sendStatus(400));
})

router.put("/:chatId/messages/markAsRead", async (req, res, next) => {
    Messages.updateMany({chat: req.params.chatId}, {$addToSet: {leidoPor: req.session.user._id}})
    .then(() => res.status(204))
    .catch(e => console.log(e));
})

router.put("/:chatId", async (req, res, next) => {
    Chat.findByIdAndUpdate(req.params.chatId, req.body) // Valor a encontrar , Objeto a actualizar
    .then(() => res.status(204))
    .catch(e => res.sendStatus(400));
})

module.exports = router;