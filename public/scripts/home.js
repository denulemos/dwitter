$(document).ready(() => {
    axios.get('/api/posts')
    .then((response) => {
      outputPosts(response.data, $(".postContainer"));
    
    })
    .catch((error) => {
      console.log(error);
    });
})

