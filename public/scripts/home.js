$(document).ready(() => {
    axios.get('/api/posts')
    .then((response) => {
      outputPosts(response.data, $(".postContainer"));
    
    })
    .catch((error) => {
      console.log(error);
    });
})

const outputPosts = (resultados, container) => {
  container.html(""); // Vaciar contenedor

  resultados.forEach(resultado => {
    const html = createPostHtml(resultado);
    container.append(html);
  });

  if (resultados.length == 0){
    container.append("<span class='vacio'>No hay Dwits encontrados</span>")
  }
}