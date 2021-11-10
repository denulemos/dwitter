let connected = false;

// Debemos conectarnos al mismo puerto
const socket = io("http://localhost:8080");
socket.emit("setup", userLoggedIn);

socket.on("conectado", () => {
    connected = true
})

socket.on("message received", (newMessage) => {
    messageReceived(newMessage);
})