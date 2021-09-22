const express = require('express');
const app = express();
const router = express.Router();

app.set("view engine", "pug");
app.set("views", "views");

// Root
router.get("/", (req, res, next) => {
    res.status(200).render("login");
})

module.exports = router;