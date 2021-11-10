let timer;
$("#searchBox").keydown((event) => {
    clearTimeout(timer);
    const textBox = $(event.target);
    let value = textBox.val();
    const searchType = textBox.data().search;

    timer = setTimeout(() => {
        value = textBox.val().trim();

        if (!value){
            $(".resultsContainer").html("");
        }
        else {
            search(value, searchType);
        }
    },1000)

})

const search = (searchTerm, searchType) => {
    const url = searchType == "users" ? "/api/users" : "/api/posts";
    $.get(url, {search: searchTerm}, (results) => {
        if (searchType == "users"){
            outputUsers(results, $(".resultsContainer"));
        }
        else {
            outputPosts(results, $(".resultsContainer"));
        }
    })
}

const outputPosts = (resultados, container) => {
    container.html(""); // Vaciar contenedor
    if (!Array.isArray(resultados)) {
      resultados = [resultados];
    }
    resultados.forEach((resultado) => {
      const html = createPostHtml(resultado);
      container.append(html);
    });
  
    if (resultados.length == 0) {
      container.append("<span class='vacio'>No hay Dwits encontrados</span>");
    }
  };

  const createPostHtml = (data, largeFont = false) => {
    if (!data.autor) {
      return;
    }
    if (!data) {
      data = data.data;
    }
  
    // Es un RD si posee el objeto RedweetData
    const isRedweet = data.redweetData !== undefined;
    const redweetAutor = isRedweet ? data.autor.usuario : null;
    data = isRedweet ? data.redweetData : data;
  
    const autor = data.autor;
    const timestamp = calculadoraTiempo(new Date(), new Date(data.createdAt));
  
    const likeButtonActiveClass = data.likes.includes(userLoggedIn._id)
      ? "active"
      : "";
    const redweetButtonActiveClass = data.redweetsUsers.includes(userLoggedIn._id)
      ? "active"
      : "";
    var largeFontClass = largeFont ? "largeFont" : "";
  
    let redweetText = "";
  
    if (isRedweet) {
      redweetText = `<span>
     <i class='fas fa-retweet'></i>
     Retweeted by <a href='/profile/${redweetAutor}'>@${redweetAutor}</a>    
  </span>`;
    }
  
    var respuestaFlag = "";
    if (data.respondeA){
      const respondeAUsername = data.respondeA.autor.usuario;
      respuestaFlag = `<div class='respuestaFlag'> Responde a <a href='/profile/${respondeAUsername}'>@${respondeAUsername}</a> </div>`;
    }
  
    //Mostrar boton para borrar Dwit
    let buttons = "";
    let dataTarget = "#confirmPinModal"
    let pinnedPostText = "";
    if (data?.autor?._id === userLoggedIn._id) {
      let pinnedClass = "";
  
      if(data.pinned){
        pinnedClass = "active";
        dataTarget = "#unpinModal";
        pinnedPostText = "<i class='fas fa-thumbtack'></i> <span>Dwit Pinned</span>";
      }
  
      buttons = `<button class='pinButton ${pinnedClass}' data-id="${data._id}" data-toggle="modal" data-target="${dataTarget}"><i class='fas fa-thumbtack'></i></button>
      <button data-id="${data._id}" data-toggle="modal" data-target="#borrarModal"><i class='fas fa-times'></i></button>`;
    }
  
    return `<div class="post ${largeFontClass}" data-id='${data._id}'>
    <div class="postActionContainer">
    ${redweetText}
    </div>
    <div class="mainContentContainer">
    <div class="imagenUsuarioContainer">
    <img src='${autor.foto}'>
    </div>
    <div class="postContentContainer">
    <div class="pinnedPostText">${pinnedPostText} </div>
    <div class="header">
      <a class="displayName" href='/profile/${autor.usuario}'>${
      autor.displayName
    }</a>
      <span class="usuario">@${autor.usuario}</span>
      <span class="date">${timestamp}</span>
      ${buttons}
    </div>
    ${respuestaFlag}
    <div class="postBody">
      <span>${data.contenido}</span>
    </div>
    <div class="postFooter">
    <div class="containerActions">
    <div class="postBotonesContainer green"> 
    <button data-toggle='modal' data-target="#responderModal">
    <i class="far fa-comment-alt"></i>
    </button> 
    </div>
    <div class="postBotonesContainer green">  
    <button class='redweetButton ${redweetButtonActiveClass}'>
    <i class="fas fa-retweet"></i>
    <span>${data.redweetsUsers.length || ""}</span>
    </button></div>
   <div class="postBotonesContainer red">
   <button class='likeButton ${likeButtonActiveClass}'>
    <i class="far fa-heart"></i>
    <span>${data.likes.length || ""}</span>
    </button> </div>
    
    </div>
    </div>
    </div>
    </div>
    </div>`;
  };

  const calculadoraTiempo = (current, previous) => {
    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;
  
    var elapsed = current - previous;
  
    if (elapsed < msPerMinute) {
      if (elapsed / 1000 < 30) return "Hace un momento";
  
      return "Hace " + Math.round(elapsed / 1000) + " segundos";
    } else if (elapsed < msPerHour) {
      return "Hace " + Math.round(elapsed / msPerMinute) + " minutos";
    } else if (elapsed < msPerDay) {
      return "Hace " + Math.round(elapsed / msPerHour) + " horas";
    } else if (elapsed < msPerMonth) {
      return "Hace " + Math.round(elapsed / msPerDay) + " dias";
    } else if (elapsed < msPerYear) {
      return "Hace " + Math.round(elapsed / msPerMonth) + " meses";
    } else {
      return "Hace " + Math.round(elapsed / msPerYear) + " años";
    }
  };

  const outputUsers = (results, container) => {
    container.html("");
    results.forEach(result => {
        const html = createUserHtml(result, true);
        container.append(html);
  
        if (!results.length){
            container.append("<span class='noResults'>No se encontraron resultados</span>")
        }
    });
  
  }

  const createUserHtml = (userData, showFollowButton) => {
    const name = userData.displayName;
    const isFollowing= userLoggedIn.siguiendo && userLoggedIn.siguiendo.includes(userData._id);
    const text = isFollowing ? "Siguiendo" : "Seguir";
    const buttonClass = isFollowing ? "followButton following" : "followButton";
    let followButton = "";
  
    // Mostrar o no el boton "seguir" en nosotros mismos
    if (showFollowButton && userLoggedIn._id != userData._id){
        followButton = `<div class="followButtonContainer">
        <button class='${buttonClass}' data-user='${userData._id}'>${text}</button>
        
        </div>`;
    }
  
    return `<div class='user'>
    <div class='imagenUsuarioContainer'>
    <img src='${userData.foto}'>
    </div>
    <div class='userDetailsContainer'>
    <div class='header'>
        <a href='/profile/${userData.usuario}'>${name}</a>
        <span class='usuario'>@${userData.usuario}</span>
    </div>
    </div>
    ${followButton}
    </div>`;
  }