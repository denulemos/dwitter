const express = require('express');
const app = express();
const port = 8080;
const middleware = require('./middleware');
const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://admin:dwitteradmin@dwittercluster.hoqbb.mongodb.net/DwitterDB?retryWrites=true&w=majority")
.then(() => console.log("Conectado a MongoDB"))
.catch(() => console.log("Error en MongoDB"))

// Servir archivos estaticos
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Rutas
const loginRoute = require("./routes/loginRoutes");
app.use("/login", loginRoute);
const signupRoute = require("./routes/signupRoutes");
app.use("/signup", signupRoute);

app.set("view engine", "pug");
app.set("views", "views");

const server = app.listen(port, () => {
    console.log('Dwitter backend it´s alive in port ' + port + "!")
});

// Root
app.get("/", middleware.requireLogin, (req, res, next) => {
    var payload = {
       pageTitle: "Dwitter | Home"
    }

    res.status(200).render("home", payload);
})