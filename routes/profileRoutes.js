const express = require('express');
const User = require('../schemas/UserSchema');
const app = express();
const router = express.Router();

// Root
router.get("/", (req, res, next) => {

    var payload = {
        pageTitle: req.session.user.usuario,
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user), // Sesion del usuario que se usará en el cliente
        profileUser: req.session.user
     }

    res.status(200).render("profilePage", payload);
})

router.get("/:usuario", async (req, res, next) => {

    var payload =  await getPayload(req.params.usuario, req.session.user);
    res.status(200).render("profilePage", payload);
})

router.get("/:usuario/replies", async (req, res, next) => {

    var payload =  await getPayload(req.params.usuario, req.session.user);
    payload.selectedTab = "replies";
    
    res.status(200).render("profilePage", payload);
})

const getPayload = async (usuario, userLoggedIn) => {
    var user = await User.findOne({usuario: usuario});

    if (!user) {
        // si no encontramos por usuario, buscamos por id
        user = await User.findById(usuario);

        if (!user){
            return {
                pageTitle: "Usuario no encontrado",
                userLoggedIn: userLoggedIn,
                userLoggedInJs: JSON.stringify(userLoggedIn), // Sesion del usuario que se usará en el cliente
            }
        }

        
    }

    return {
        pageTitle: user.usuario,
        userLoggedIn: userLoggedIn,
        userLoggedInJs: JSON.stringify(userLoggedIn), // Sesion del usuario que se usará en el cliente
        profileUser: user
    }
}


module.exports = router;