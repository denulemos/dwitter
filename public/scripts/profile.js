$(document).ready(()=> {
    if (selectedTab === "replies"){
        loadPostsReply();
    }
    else {
        loadPosts();
    }
    
});

const loadPosts = () => {
    // Obtener el Dwit pinneado
    $.get('/api/posts', {autor: userProfileId, pinned: true} ,response => {
      outputPinnedPost(response, $(".pinnedPostContainer"));
    })

    $.get('/api/posts', {autor: userProfileId, isReply: false} ,response => {
        outputPosts(response, $(".postContainer"));
      })
};

const loadPostsReply = () => {
    $.get('/api/posts', {autor: userProfileId, isReply: true}, response => {
outputPosts(response, $(".postContainer"));
    })
};

const outputPinnedPost = (resultados, container) => {
    if (!resultados.length) {
        container.hide();
        return;
    }

    container.html(""); // Vaciar contenedor

    resultados.forEach((resultado) => {
      const html = createPostHtml(resultado);
      container.append(html);
    });

  };