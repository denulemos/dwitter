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
    const textBox = $("#postTextArea");

    axios.post('/api/posts', {
        contenido: textBox.val()
    })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });


});