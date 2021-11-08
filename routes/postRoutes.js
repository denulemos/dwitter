const express = require('express');
const app = express();
const router = express.Router();

// Root
router.get("/:id", (req, res, next) => {

    var payload = {
        pageTitle: "Detalle Dwit",
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user), // Sesion del usuario que se usará en el cliente
        postId: req.params.id
     }

    res.status(200).render("postPage", payload);
})


module.exports = router;