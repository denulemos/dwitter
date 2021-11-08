const express = require('express');
const app = express();
const router = express.Router();

// Root
router.get("/", (req, res, next) => {
    let payload = createPayload(req);

    res.status(200).render("searchPage", payload);
})

router.get("/:selectedTab", (req, res, next) => {
    let payload = createPayload(req);
    payload.selectedTab = req.params.selectedTab;
    res.status(200).render("searchPage", payload);
})

const createPayload = (req) => {
    return {
        pageTitle: "Búsqueda",
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user),
    };
}


module.exports = router;