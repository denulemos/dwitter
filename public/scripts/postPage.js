$(document).ready(() => {
    axios.get('/api/posts/' + postId)
    .then((response) => {
      outputPostsWithReplies(response.data, $(".postContainer"));
    
    })
    .catch((error) => {
      console.log(error);
    });
})

