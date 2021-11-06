const express = require('express');
const path = require('path');
const router = express.Router();

// Root
router.get("/images/:path", (req, res, next) => {
    res.sendFile(path.join(__dirname, "../uploads/images/" + req.params.path));
})


module.exports = router;