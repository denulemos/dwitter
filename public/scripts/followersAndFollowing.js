$(document).ready(()=> {

    if (selectedTab === "seguidores"){
        loadFollowers();
    }
    else {
        loadFollowing();
    }
    
});

const loadFollowers = () => {
    axios.get(`/api/users/${userProfileId}/seguidores` )
    .then((response) => {
        outputUsers(response.data.seguidores, $(".resultsContainer"));
    
    })
    .catch((error) => {
      console.log(error);
    });
}

const loadFollowing = () => {
    axios.get(`/api/users/${userProfileId}/siguiendo`)
    .then((response) => {
        outputUsers(response.data.siguiendo, $(".resultsContainer"));
    
    })
    .catch((error) => {
      console.log(error);
    });
}

