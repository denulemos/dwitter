const express = require('express');
const mongoose = require('mongoose');
const app = express();
const router = express.Router();
const Chat = require('../schemas/ChatSchema');
const User = require('../schemas/UserSchema');

// Root
router.get("/", (req, res, next) => {
    res.status(200).render("inboxPage", {
        pageTitle: "Inbox",
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user),
    });
})

router.get("/new", (req, res, next) => {
    res.status(200).render("newMessage", {
        pageTitle: "Nuevo Mensaje",
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user),
    });
})

router.get("/:chatId", async (req, res, next) => {
    const userId = req.session.user._id;
    const chatId = req.params.chatId;
    const isValidId = mongoose.isValidObjectId(chatId);

    let payload = {
        pageTitle: "Chat",
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user)
    };

    if (!isValidId){
        payload.errorMessage = "El chat no existe o no tenés permisos para verlo :(";
        return res.status(200).render("chatPage", payload);
    }

    // Chequeamos si el chat existe y si el usuario es parte del mismo para no acceder a chats ajenos
    let chat = await Chat.findOne({_id: chatId, usuarios: {$elemMatch: {$eq: userId}}})
    .populate("usuarios");

    if (!chat){
        const userFound = await User.findById(chatId);
        if (userFound){
            chat = await getChatByUserId(userFound._id, userId);
        }
    }

    // O el chat no existe o el usuario no es parte del mismo
    if (!chat){

    }
    else {
        payload.chat = chat;
    }


    res.status(200).render("chatPage", payload);
})

const getChatByUserId = (userLoggedInId, otherUserId) => {
    // Si el chat no existe, lo creamos
    return Chat.findOneAndUpdate({
        esChatGrupal: false,
        usuarios: {
            $size: 2,
            $all: [
                {$elemMatch: {$eq: userLoggedInId}},
                {$elemMatch: {$eq: otherUserId}},
            ]
        }
    },
    {
        $setOnInsert: {
            usuarios: [userLoggedInId, otherUserId]
        }
    },
    {
        new: true,
        upsert: true // Si no lo encontró, crearlo 
    })
    .populate("usuarios");
}


module.exports = router;