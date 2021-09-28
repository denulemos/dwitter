const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const User = require('../schemas/UserSchema');
const router = express.Router();

app.set("view engine", "pug");
app.set("views", "views");

app.use(express.urlencoded({extended: false }));

// Root
router.get("/", (req, res, next) => {
    res.status(200).render("login");
})

router.post("/", async(req, res, next) => {

    const payload = req.body;

    const user = await User.findOne({
        $or: [
            {usuario: req.body.usuario},
            {email: req.body.usuario}
        ]
    })
    .catch((e) => {
      payload.errorMessage = e;
      res.status(200).render("login", payload);
    });

    // Se encontro usuario
    if (user !== null){
        const result = await bcrypt.compare(req.body.password, user.password);

        if (result){
            // Creamos la sesion
            req.session.user = user;
            return res.redirect("/");
        }
    }

    payload.errorMessage = "Credenciales incorrectas";
    return res.status(200).render("login", payload);
})

module.exports = router;