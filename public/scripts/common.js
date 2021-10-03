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
      const html = createPostHtml(response);
    $(".postContainer").prepend(html);
    textBox.val("");
    boton.prop("disabled", true);

    })
    .catch((error) => {
      console.log(error);
    });


});

const createPostHtml = (data) => {
  return `<div>${}</div>`;
}