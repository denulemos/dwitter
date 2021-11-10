$(document).ready(() => {
    axios.get('/api/posts', {followingOnly: true})
    .then((response) => {
      $(".loadingSpinnerContainer").remove();
      outputPosts(response.data, $(".postContainer"));
    
    })
    .catch((error) => {
      console.log(error);
    });
})

