const express = require('express');
const app = express();
const port = 8080;

const server = app.listen(port, () => {
    console.log('Dwitter backend it´s alive in port ' + port + "!")
});

app.set("view engine", "pug");
app.set("views", "views");

// Root
app.get("/", (req, res, next) => {
    var payload = {
       pageTitle: "Dwitter | Home"
    }

    res.status(200).render("home", payload);
})