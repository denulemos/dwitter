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