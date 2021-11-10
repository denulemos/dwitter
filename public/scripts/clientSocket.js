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

socket.on("notification received", () => {
    $.get("/api/notifications/latest", (notificationData) => {
        showNotificationPopup(notificationData);
        refreshNotificationsBadge();
    })
})

const emitNotification = (userId) => {
    if (userId == userLoggedIn._id) return;
    socket.emit("notification received", userId);
}