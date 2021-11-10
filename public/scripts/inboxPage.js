$(document).ready (() => {
    axios.get('/api/chats')
    .then((response) => {
        outputChatList(response, $(".resultsContainer"));
    
    })
    .catch((error) => {
      console.log(error);
    });
})

const outputChatList = (chatList, container) => {
    chatList.data.forEach(chat => {
        let html = createChatHtml(chat);
        container.append(html);
    })

    if (!chatList.data.length){
        container.append("<span class='noResults'> No hay nada que mostrar </span>");
    }
}

const createChatHtml = (chatData) => {
    console.log(chatData);
    const chatName = getChatName(chatData);
    const image = getChatImageElements(chatData); //TODO
    const latestMessage = "Placeholder mesnsaje "; //TODO

    return `<a href='/messages/${chatData._id}' class='resultListItem'>
        ${image}
        <div class="resultsDetailsContainer ellipsis">
            <span class='heading ellipsis'>${chatName}</span>
            <span class='subText ellipsis'>${latestMessage}</span>
        </div>
    </a>`;
}

const getChatName = (chatData) => {
    let chatName = chatData.nombreChat;

    if (!chatName){
        const otherChatUsers = getOtherChatUsers(chatData.usuarios);
        return otherChatUsers.map(user => user.displayName).join(", ");
    }
    else {
        return chatName;
    }

    
}

const getOtherChatUsers = (users) => {
    if (users.length === 1) return users;

    return users.filter((usuario) => {
        return usuario._id != userLoggedIn._id;
    } )
}

const getChatImageElements = (chatData) => {
    const otherChatUsers = getOtherChatUsers(chatData.usuarios);
    let groupChatClass = "";
    let chatImage = getUserChatImageElement(otherChatUsers[0]);

    // Toma las imagenes de los primeros dos usuarios en el chat
    if (otherChatUsers.length > 1) {
        groupChatClass = "groupChatImage";
        chatImage +=getUserChatImageElement(otherChatUsers[1]);
    }

    return `<div class='resultsImageContainer ${groupChatClass}'>${chatImage}</div>`;

}

const getUserChatImageElement = (chatUser) => {
    if (!chatUser || !chatUser.foto){
        return alert("Hubo un error con los usuarios");
    }

    return `<img src='${chatUser.foto}' alt='Foto perfil'/>`
}