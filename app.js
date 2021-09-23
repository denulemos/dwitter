const express = require('express');
const app = express();
const port = 8080;
const middleware = require('./middleware');

// Rutas
const loginRoute = require("./routes/loginRoutes");

const server = app.listen(port, () => {
    console.log('Dwitter backend it´s alive in port ' + port + "!")
});

app.set("view engine", "pug");
app.set("views", "views");
app.use("/login", loginRoute);


// Root
app.get("/", middleware.requireLogin, (req, res, next) => {
    var payload = {
       pageTitle: "Dwitter | Home"
    }

    res.status(200).render("home", payload);
})