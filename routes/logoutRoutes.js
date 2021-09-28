const express = require('express');
const app = express();
const router = express.Router();


app.use(express.urlencoded({extended: false }));

// Root
router.get("/", (req, res, next) => {
    if (req.session) {
        req.session.destroy(()=> {
            res.redirect("/login");
        })
    }
})



module.exports = router;