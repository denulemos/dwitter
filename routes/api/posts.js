const express = require('express');
const app = express();
const User = require('../../schemas/UserSchema');
const Post = require('../../schemas/PostSchema');
const router = express.Router();

app.use(express.urlencoded({extended: false }));

router.get("/", (req, res, next) => {
    
})

router.post("/", async(req, res, next) => {
    // Esta la request vacia?
    if (!req.body.contenido){
        return res.sendStatus(400);
    }

    const data = {
        contenido :req.body.contenido,
        autor: req.session.user
    }

    Post.create(data)
    .then(async (post) => {
        // Popular el campo Autor con los datos del usuario cuya sesion esta activa
        post = await User.populate(post, {path: "autor"});

        // 201 Created
        res.status(201).send(post);
    })
    .catch((e) => {
        console.log(e);
        res.sendStatus(400);
    })
})

module.exports = router;