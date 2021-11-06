$(document).ready(()=> {
    if (selectedTab === "replies"){
        loadPostsReply();
    }
    else {
        loadPosts();
    }
    
});

const loadPosts = () => {
    axios.get('/api/posts', {autor: userProfileId, isReply: false})
    .then((response) => {
      console.log(response);
      outputPosts(response.data, $(".postContainer"));
    
    })
    .catch((error) => {
      console.log(error);
    });
}

const loadPostsReply = () => {
    axios.get('/api/posts', {autor: userProfileId, isReply: true})
    .then((response) => {
      outputPosts(response.data, $(".postContainer"));
    
    })
    .catch((error) => {
      console.log(error);
    });
}