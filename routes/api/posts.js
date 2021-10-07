const express = require('express');
const app = express();
const User = require('../../schemas/UserSchema');
const Post = require('../../schemas/PostSchema');
const router = express.Router();

app.use(express.urlencoded({
    extended: false
}));

// Obtener posts
router.get("/", (req, res, next) => {
    Post.find()
        .populate("autor") // Obtener el objeto entero del autor 
        .sort({"createdAt": -1}) // Ordenar los dwits
        .then(response =>
            res.status(200).send(response)
        ).catch(e => console.log(e))
})

router.post("/", async (req, res, next) => {
    // Esta la request vacia?
    if (!req.body.data.contenido) {
        console.log(req.body.data.contenido);
        return res.sendStatus(400);
    }

    const data = {
        contenido: req.body.data.contenido,
        autor: req.session.user
    }


    Post.create(data)
        .then(async (post) => {
            // Popular el campo Autor con los datos del usuario cuya sesion esta activa
            post = await User.populate(post, {
                path: "autor"
            });

            // 201 Created
            res.status(201).send(post);
        })
        .catch((e) => {
            console.log(e);
            res.sendStatus(400);
        })
})

module.exports = router;