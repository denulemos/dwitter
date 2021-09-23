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
    console.log(req.body);
    res.status(200).render("signup");
})

module.exports = router;