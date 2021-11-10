let typing = false;
let lastTypingTime;

$(document).ready(() => {
    socket.emit("join room", chatId);
    socket.on("typing", () => {
        $(".typingDots").show();
    })
    socket.on("stop typing", () => {
        $(".typingDots").hide();
    })
    
    $.get(`/api/chats/${chatId}`, (data) => {
        $("#chatName").text(getChatName(data));
    })

    $.get(`/api/chats/${chatId}/messages`, (data)=>{
        let messages = [];
        let lastSenderId = '';

        data.forEach((message, index) => {
            console.log(data);
            let html = createMessageHtml(message, data[index], lastSenderId);
            messages.push(html);

            lastSenderId = message.emisor._id;
        });

        let messagesHtml = messages.join("");
        addMessagesHtmlToPage(messagesHtml);
        scrollToBottom(false);

        $(".loadingSpinnerContainer").remove();
        $(".chatContainer").css("visibility", "visible");
    })
})
$("#chatNameButton").click(() => {
    let name = $("#chatNameTextbox").val().trim();
    
    $.ajax({
        url: '/api/chats/' + chatId,
        type: "PUT",
        data: {nombreChat: name},
    })
    location.reload();
})

$(".sendMessageButton").click(() => {
    messageSubmitted();
})

// Que se pueda mandar con enter también
$(".inputTextbox").keydown((event) => {
    updateTyping();

    if (event.which == 13) {
        messageSubmitted();
        return false;
    }
})

const updateTyping = () => {
    // Chequeo si estoy conectado al socket
    if (!connected) return;
    if (!typing){
        typing = true;
        socket.emit("typing", chatId);
    }

    lastTypingTime = new Date().getTime();
    let timerLength = 3000;

    setTimeout(() => {
        let timeNow = new Date().getTime();
        let timeDiff = timeNow - lastTypingTime;
        if (timeDiff >=timerLength && typing){
            socket.emit("stop typing", chatId);
            typing = false;
        }
    }, timerLength)
}

const messageSubmitted = () => {
    const content = $(".inputTextbox").val().trim();
    if (content !== ''){
        sendMessage(content);
        $(".inputTextbox").val("");
        socket.emit("stop typing", chatId);
        typing = false;
    }   
}

const sendMessage = (content) => {

    $.post("/api/messages", {contenido: content, chatId: chatId}, (data, status, xhr) => {
        if (xhr.status != 201){
            console.log("Error sendMessage");
            $(".inputTextbox").val(content);
            return;
        }
        addChatMessageHtml(data);
        if (connected){
            socket.emit('new message', data);
        }
    })
}

const addChatMessageHtml = (message) => {
    if (!message || !message._id){
        // Si el mensaje no tiene ID quiere decir que no fue populado
        console.log("Error addChatMessageHTML")
        return;
    }

    const messageDiv = createMessageHtml(message, null, "");
    addMessagesHtmlToPage(messageDiv);
    scrollToBottom(true);
}

const addMessagesHtmlToPage = (html) => {
    $(".chatMessages").append(html);
}

const createMessageHtml = (message, nextMessage, lastSenderId) => {
    const emisor = message.emisor;
    const emisorName = emisor.displayName;
    const currentSenderId = emisor._id;
    const nextSenderId = nextMessage ? nextMessage.emisor._id : '';
    const isFirst = lastSenderId != currentSenderId;
    const isLast = nextSenderId != currentSenderId;

    // Es mi mensaje?
    const isMine = message.emisor._id == userLoggedIn._id;
    let liClassName = isMine ? "mine" : "theirs";
    
    let nameElement = "";

    if (isFirst) {
        liClassName += " first";
        if (!isMine){
            nameElement = `<span class='senderName'>${emisorName}</span>`;
        }
    }

    let profileImage = '';

    if (isLast) {
        liClassName += " last";
        console.log(emisor);
        profileImage = `<img src='${emisor.foto}'>`
    }

    let imageContainer = "";

    if (!isMine) {
        imageContainer= `<div class='imageContainer'>
            ${profileImage}
        </div>`
    }

    return `<li class='message ${liClassName}'>
        ${imageContainer}
        <div class='messageContainer'>
            ${nameElement}
            <span class='messageBody'>
                ${message.contenido}
            </span>
        </div>
    </li>`;
}

const scrollToBottom = (animated) => {
    const container = $(".chatMessages");
    const scrollHeight = container[0].scrollHeight;

    if (animated){
        container.animate({scrollTop: scrollHeight}, "slow");
    }
    else {
        container.scrollTop(scrollHeight);
    }
}