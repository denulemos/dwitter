const express = require('express');
const mongoose = require('mongoose');
const app = express();
const router = express.Router();
const Chat = require('../schemas/ChatSchema');
const User = require('../schemas/UserSchema');

// Root
router.get("/", (req, res, next) => {
    res.status(200).render("notificationsPage", {
        pageTitle: "Notificaciones",
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user),
    });
})

module.exports = router;