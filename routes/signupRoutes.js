const express = require('express');
const app = express();
const router = express.Router();

app.set("view engine", "pug");
app.set("views", "views");

app.use(express.json());
app.use(express.urlencoded({extended: false }));


router.get("/", (req, res, next) => {
    res.status(200).render("signup");
})
router.post("/", (req, res, next) => {
    const usuario = req.body.usuario.trim();
    const email = req.body.email.trim();
    const password = req.body.password;

    const payload = req.body;

    
})

module.exports = router;