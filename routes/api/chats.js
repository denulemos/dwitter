const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const User = require('../../schemas/UserSchema');
const Post = require('../../schemas/PostSchema');
const Chat = require('../../schemas/ChatSchema');

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
    .sort({updatedAt: -1}) // Ordenar los chats por mas recientes
    .then(results => res.status(200).send(results))
    .catch(e => res.sendStatus(400));
})

module.exports = router;