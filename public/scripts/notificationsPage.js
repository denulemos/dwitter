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

const createNotificationHtml = (notification) => {
    let userFrom = notification.emisor;
    const text = getNotificationText(notification);
    const href = getNotificationUrl(notification);
    const className = notification.visto ? "" : "active";

    return `<a href='${href}' data-id='${notification._id}' class='resultListItem notification ${className}'>
        <div class='resultsImageContainer'>
         <img src='${userFrom.foto}'>
       
        </div>
        <div class='resultsDetailsContainer ellipsis'>
        <span class='ellipsis'>${text}</span>
     </div>
    </a>`
}

const getNotificationText = (notification) => {
    userFrom = notification.emisor;
    if (!userFrom.displayName){
        return console.log('Usuario no tiene displayname');
    }
    let text;
    if (notification.tipoNotificacion == "redweet"){
        text = `${userFrom.displayName} redwitteo un post tuyo!`;
    }
    else if (notification.tipoNotificacion == "postLike"){
        text = `${userFrom.displayName} likeo un post tuyo!`;
    }
    else if (notification.tipoNotificacion == "reply"){
        text = `${userFrom.displayName} respondió a un post tuyo!`;
    }
    else if (notification.tipoNotificacion == "follow"){
        text = `${userFrom.displayName} te esta siguiendo!`;
    }

    return `<span class='ellipsis'>${text}</span>`
}

const getNotificationUrl = (notification) => {
    let url= "#";
    if (notification.tipoNotificacion == "redweet" || 
    notification.tipoNotificacion == "postLike" || 
    notification.tipoNotificacion == "reply"){
        url = `/post/${notification.entityId}`;
    }
    else if (notification.tipoNotificacion == "follow"){
        url = `/profile/${notification.entityId}`;
    }

    return url;
}