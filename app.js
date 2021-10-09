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
const signupRoute = require("./routes/signupRoutes");
const logoutRoute = require("./routes/logoutRoutes");
const postsApiRoute = require("./routes/api/posts");

app.use("/logout", logoutRoute);
app.use("/login", loginRoute);
app.use("/signup", signupRoute);
app.use("/api/posts", postsApiRoute);

// Seteo motor visual
app.set("view engine", "pug");
app.set("views", "views");

const server = app.listen(port, () => {
    console.log('I am alive and well in port ' + port + ", thanks mother")
});

// Root
app.get("/", middleware.requireLogin, (req, res, next) => {
    var payload = {
       pageTitle: "Dwitter",
       userLoggedIn: req.session.user,
       userLoggedInJs: JSON.stringify(req.session.user), // Sesion del usuario que se usará en el cliente
    }

    res.status(200).render("home", payload);
})