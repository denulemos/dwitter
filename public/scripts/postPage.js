$(document).ready(() => {
    axios.get('/api/posts/' + postId)
    .then((response) => {
      outputPosts(response.data, $(".postContainer"));
    
    })
    .catch((error) => {
      console.log(error);
    });
})

