$(document).ready(()=> {
    if (selectedTab === "replies"){
        loadPostsReply();
    }
    else {
        loadPosts();
    }
    
});

const loadPosts = () => {
    $.get('/api/posts', {autor: userProfileId, isReply: false} ,response => {
      console.log(response);
      outputPosts(response, $(".postContainer"));
    })
};

const loadPostsReply = () => {
    $.get('/api/posts', {autor: userProfileId, isReply: true}, response => {
outputPosts(response, $(".postContainer"));
    })
};