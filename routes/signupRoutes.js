const express = require('express');
const app = express();
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../schemas/UserSchema');

app.set("view engine", "pug");
app.set("views", "views");

app.use(express.json());
app.use(express.urlencoded({extended: false }));


router.get("/", (req, res, next) => {
    res.status(200).render("signup");
})

router.post("/", async (req, res, next) => {
    const usuario = req.body.usuario.trim();
    const email = req.body.email.trim();
    const password = req.body.password;

    const payload = req.body;

    // ¿El usuario o el email ya están en uso?
    const user = await User.findOne({
        $or: [
            {usuario: usuario},
            {email: email}
        ]
    })
    .catch((e) => {
      payload.errorMessage = e;
      res.status(200).render("signup", payload);
    });



    if (user == null) {
        const data = req.body;

        // Encriptamos la contraseña 
        data.password = await bcrypt.hash(password, 10);

        User.create(data)
        .then((user)=> {
            req.session.user = user;
            return res.redirect("/");
        });
    }
    else{
        payload.errorMessage = email == user.email ? "Email en uso" : "Usuario en uso";
        res.status(200).render("signup", payload);
    }
    

    
})

module.exports = router;