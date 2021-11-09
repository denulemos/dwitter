const express = require('express');
const app = express();
const router = express.Router();

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


module.exports = router;