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

const outputUsers = (results, container) => {
    container.html("");
    results.forEach(result => {
        const html = createUserHtml(result, true);
        container.append(html);

        if (!results.length){
            container.append("<span class='noResults'>No se encontraron resultados</span>")
        }
    });

}

const createUserHtml = (userData, showFollowButton) => {
    const name = userData.displayName;
    const isFollowing= userLoggedIn.siguiendo && userLoggedIn.siguiendo.includes(userData._id);
    const text = isFollowing ? "Siguiendo" : "Seguir";
    const buttonClass = isFollowing ? "followButton following" : "followButton";
    let followButton = "";

    // Mostrar o no el boton "seguir" en nosotros mismos
    if (showFollowButton && userLoggedIn._id != userData._id){
        followButton = `<div class="followButtonContainer">
        <button class='${buttonClass}' data-user='${userData._id}'>${text}</button>
        
        </div>`;
    }

    return `<div class='user'>
    <div class='imagenUsuarioContainer'>
    <img src='${userData.foto}'>
    </div>
    <div class='userDetailsContainer'>
    <div class='header'>
        <a href='/profile/${userData.usuario}'>${name}</a>
        <span class='usuario'>@${userData.usuario}</span>
    </div>
    </div>
    ${followButton}
    </div>`;
}