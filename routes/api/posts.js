const express = require('express');
const app = express();
const User = require('../../schemas/UserSchema');
const router = express.Router();

app.use(express.urlencoded({extended: false }));

router.get("/", (req, res, next) => {
    
})

router.post("/", async(req, res, next) => {
    // Esta la request vacia?
    if (!req.body.contenido){
        return res.sendStatus(400);
    }

    
    res.status(200);
})

module.exports = router;