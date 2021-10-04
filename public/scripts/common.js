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
  const timestamp = 'Hace un momento'

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