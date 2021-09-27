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
    const contrasenia = req.body.contrasenia;

    const payload = req.body;

    // Estan todos los campos llenos?
    if (usuario && email && contrasenia) {

    }
    else{
        payload.errorMessage = "Completá todos los campos";
        res.status(200).render("signup", payload);
    }
})

module.exports = router;