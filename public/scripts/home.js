$(document).ready(() => {
    axios.get('/api/posts', {followingOnly: true})
    .then((response) => {
      outputPosts(response.data, $(".postContainer"));
    
    })
    .catch((error) => {
      console.log(error);
    });
})

