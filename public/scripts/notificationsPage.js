$(document).ready(() => {
    $.get("/api/notifications", (data) => {
        outputNotificationList(data, $('.resultsContainer'));
    })
})

const outputNotificationList = (notifications, container) => {
    notifications.forEach(notification => {
        let html = createNotificationHtml(notification);
        container.append(html);
    })
    if (notifications.length == 0){
        container.append("<span class='noResults'>Nada para mostrar :( </span>");

    }
}

$("#markNotificationsAsRead").click(() => markNotificationsAsOpened());

