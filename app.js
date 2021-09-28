const express = require('express');
const app = express();
const port = 8080;
const middleware = require('./middleware');
const mongoose = require('./database');
const session = require('express-session');

// Servir archivos estaticos
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

// Uso de sesiones
app.use(session({
    // Hashear una sesion
    secret: 'megustanlasmilanesas',
    resave: true,
    saveUninitialized: false
}))

app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Rutas
const loginRoute = require("./routes/loginRoutes");
app.use("/login", loginRoute);
const signupRoute = require("./routes/signupRoutes");
app.use("/signup", signupRoute);
const logoutRoute = require("./routes/logoutRoutes");
app.use("/logout", logoutRoute);

app.set("view engine", "pug");
app.set("views", "views");

const server = app.listen(port, () => {
    console.log('I AM ALIVEEEEEE in port ' + port + " thanks mother")
});

// Root
app.get("/", middleware.requireLogin, (req, res, next) => {
    var payload = {
       pageTitle: "Dwitter | Home",
       userLoggedIn: req.session.user
    }

    res.status(200).render("home", payload);
})