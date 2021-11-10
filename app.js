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
const chatsApiRoute = require("./routes/api/chats");
const notificationsApiRoute = require("./routes/api/notifications");
const postPageRoute = require("./routes/postRoutes");
const profilePageRoute = require("./routes/profileRoutes");
const usersApiRoute = require("./routes/api/users");
const uploadRoute = require("./routes/uploadRoutes");
const searchRoute = require("./routes/searchRoutes");
const messagesRoute = require("./routes/messagesRoutes");
const messagesApiRoute = require("./routes/api/messages");
const notificationsRoute = require("./routes/notificationRoutes");

app.use("/logout", logoutRoute);
app.use("/login", loginRoute);
app.use("/signup", signupRoute);
app.use("/api/posts", postsApiRoute);
app.use("/post",middleware.requireLogin, postPageRoute);
app.use("/profile",middleware.requireLogin, profilePageRoute);
app.use("/api/users", usersApiRoute);
app.use("/api/notifications", notificationsApiRoute);
app.use("/api/messages", messagesApiRoute);
app.use("/api/chats", chatsApiRoute);
app.use("/uploads", uploadRoute);
app.use("/notifications",middleware.requireLogin, notificationsRoute);
app.use("/search",middleware.requireLogin, searchRoute);
app.use("/messages",middleware.requireLogin, messagesRoute);


// Seteo motor visual
app.set("view engine", "pug");
app.set("views", "views");

const server = app.listen(port, () => {
    console.log('I am alive and well in port ' + port + ", thanks mother")
});

const io = require("socket.io")(server, {pingTimeout: 60000});

// Root
app.get("/", middleware.requireLogin, (req, res, next) => {
    var payload = {
       pageTitle: "Dwitter",
       userLoggedIn: req.session.user,
       userLoggedInJs: JSON.stringify(req.session.user), // Sesion del usuario que se usará en el cliente
    }

    res.status(200).render("home", payload);
})

io.on("connection", (socket) => {
    socket.on("setup", userData => {
        socket.join(userData._id);
        socket.emit("conectado");
    })

    socket.on("join room", room => socket.join(room));
    socket.on("typing", room => socket.in(room).emit("typing"));
    socket.on("stop typing", room => socket.in(room).emit("stop typing"));
    socket.on("new message", newMessage => {
        const chat = newMessage.chat;
        if (!chat.usuarios) return console.log("Usuarios de chat nulos");

        chat.usuarios.forEach(user => {
            // No queremos enviarnos el mensaje a nosotros mismos
            if(user._id == newMessage.emisor._id) return;
            socket.in(user._id).emit("message received", newMessage);
        })
    });
})