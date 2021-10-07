$("#postTextArea").keyup(event => {
    var value = $(event.target).val().trim();
    const enviarPostButton = $("#enviarPostButton");
    if (value == ""){
        enviarPostButton.prop("disabled", true);
        return;
    }

    enviarPostButton.prop("disabled", false);

});

$("#enviarPostButton").click(() => {
    const boton = $(event.target);
    const textBox = $("#postTextArea")

    const data = {
      contenido: textBox.val()
    }
    

    // Publicar Dwit y renderizarlo en la pagina
    axios.post('/api/posts', {data})
    .then((response) => {
      const html = createPostHtml(response.data);
    $(".postContainer").prepend(html);
    textBox.val("");
    boton.prop("disabled", true);

    })
    .catch((error) => {
      console.log(error);
    });


});

const createPostHtml = (data) => {

  const autor = data.autor;
  const timestamp = calculadoraTiempo(new Date(), new Date(data.createdAt));

  return `<div class="post">
  <div class="mainContentContainer">
  <div class="imagenUsuarioContainer">
  <img src='${autor.foto}'>
  </div>
  <div class="postContentContainer">
  <div class="header">
    <a class="displayName" href='/profile/${autor.usuario}'>${autor.displayName}</a>
    <span class="usuario">@${autor.usuario}</span>
    <span class="date">${timestamp}</span>
  </div>
  <div class="postBody">
    <span>${data.contenido}</span>
  </div>
  <div class="postFooter">
  <div class="postBotonesContainer">
  <button>
  <i class="far fa-comment-alt"></i>
  </button>
  <button>
  <i class="fas fa-retweet"></i>
  </button>
  <button>
  <i class="far fa-heart"></i>
  </button>
  </div>
  </div>
  </div>
  </div>
  </div>`;
}

const calculadoraTiempo = (current, previous) =>  {

  var msPerMinute = 60 * 1000;
  var msPerHour = msPerMinute * 60;
  var msPerDay = msPerHour * 24;
  var msPerMonth = msPerDay * 30;
  var msPerYear = msPerDay * 365;

  var elapsed = current - previous;

  if (elapsed < msPerMinute) {
      if(elapsed/1000 < 30) return "Hace un momento";
      
      return 'Hace ' + Math.round(elapsed/1000) + ' segundos';   
  }

  else if (elapsed < msPerHour) {
       return 'Hace ' + Math.round(elapsed/msPerMinute) + ' minutos';   
  }

  else if (elapsed < msPerDay ) {
       return 'Hace ' + Math.round(elapsed/msPerHour ) + ' horas';   
  }

  else if (elapsed < msPerMonth) {
      return 'Hace ' +Math.round(elapsed/msPerDay) + ' dias';   
  }

  else if (elapsed < msPerYear) {
      return 'Hace ' +Math.round(elapsed/msPerMonth) + ' meses';   
  }

  else {
      return 'Hace ' +Math.round(elapsed/msPerYear ) + ' años';   
  }
}