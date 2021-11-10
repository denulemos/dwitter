// Globals
let cropper;
let timer;
let selectedUsers = [];

$("#postTextArea, #respuestaTextArea").keyup((event) => {
  const textbox = $(event.target);
  const value = $(event.target).val().trim();

  // Chequeamos si es el modal de respuesta
  const isModal = textbox.parents(".modal").length == 1;
  const enviarPostButton = isModal
    ? $("#responderButton")
    : $("#enviarPostButton");

  if (value == "") {
    enviarPostButton.prop("disabled", true);
    return;
  }

  enviarPostButton.prop("disabled", false);
});

$("#enviarPostButton, #responderButton").click((event) => {
  const boton = $(event.target);
  const isModal = boton.parents(".modal").length == 1;
  const textBox = isModal ? $("#respuestaTextArea") : $("#postTextArea");

  const data = {
    contenido: textBox.val(),
  };

  if (isModal) {
    const id = boton.data().id;
    if (id == null) return console.log("error with button id");
    data.respondeA = id;
  }

  // Publicar Dwit y renderizarlo en la pagina
  axios
    .post("/api/posts", { data })
    .then((response) => {
      if (response.data.respondeA) {
        location.reload();
      } else {
        const html = createPostHtml(response.data);
        $(".postContainer").prepend(html);
        textBox.val("");
        boton.prop("disabled", true);
      }
    })
    .catch((error) => {
      console.log(error);
    });
});

// Evento nativo de bootstrap
$("#responderModal").on("show.bs.modal", (event) => {
  const boton = $(event.relatedTarget);
  const id = getElementId(boton);
  $("#responderButton").data("id", id);

  axios
    .get("/api/posts/" + id)
    .then((response) => {
      outputPosts(response.postData, $("#originalPostContainer"));
    })
    .catch((error) => {
      console.log(error);
    });
});

$("#userSearchTextbox").keydown((event) => {
  clearTimeout(timer);
  const textBox = $(event.target);
  let value = textBox.val();

  //keycode 8 => Tecla de borrar
  if (!value && (event.which == 8 || event.keyCode == 8)){
    selectedUsers.pop();
    updateSelectedUsersHtml();
    $(".resultsContainer").html("");

    if (selectedUsers.length == 0) {
      $("#createChatButton").prop("disabled", true);
    }

    return;
  }

  timer = setTimeout(() => {
      value = textBox.val().trim();

      if (!value){
          $(".resultsContainer").html("");
      }
      else {
          searchUsers(value);
      }
  },1000)

})

$("#responderModal").on("hidden.bs.modal", () =>
  $("#originalPostContainer").html("")
);

$("#borrarModal").on("show.bs.modal", (event) => {
  const boton = $(event.relatedTarget);
  const id = getElementId(boton);
  $("#borrarButton").data("id", id);
});

$("#confirmPinModal").on("show.bs.modal", (event) => {
  const boton = $(event.relatedTarget);
  const id = getElementId(boton);
  $("#pinPostButton").data("id", id);
});

$("#unpinModal").on("show.bs.modal", (event) => {
  const boton = $(event.relatedTarget);
  const id = getElementId(boton);
  $("#unpinPostButton").data("id", id);
});

$("#borrarButton").click((event) => {
  const id = $(event.target).data("id");

  axios
    .delete("/api/posts/" + id)
    .then(() => {
      // Cuando el post se elimina la pagina se recarga
      location.reload();
    })
    .catch((error) => {
      console.log(error);
    });
});

$("#pinPostButton").click((event) => {
  const id = $(event.target).data("id");

  axios
    .put("/api/posts/" + id, {pinned: true})
    .then(() => {
      location.reload();
    })
    .catch((error) => {
      console.log(error);
    });
});

$("#unpinPostButton").click((event) => {
  const id = $(event.target).data("id");

  axios
    .put("/api/posts/" + id, {pinned: false})
    .then(() => {
      location.reload();
    })
    .catch((error) => {
      console.log(error);
    });
});

// Subir imagen de perfil
$("#filePhoto").change((event) => {
  
  if(event.target.files && event.target.files[0]){
    const reader = new FileReader();
    reader.onload = (e) => {
      const image = document.getElementById("imagePreview");
      image.src = e.target.result;
      
      // Singleton 
      if (cropper) {
        cropper.destroy();
      }

      cropper = new Cropper(image, {
        aspectRatio: 1 / 1,
        background: false
      });
    }
    reader.readAsDataURL(event.target.files[0]);
  }
});

// Subir imagen de portada
$("#coverPhoto").change((event) => {
  
  if(event.target.files && event.target.files[0]){
    const reader = new FileReader();
    reader.onload = (e) => {
      const image = document.getElementById("coverPreview");
      image.src = e.target.result;
      
      // Singleton 
      if (cropper) {
        cropper.destroy();
      }

      cropper = new Cropper(image, {
        aspectRatio: 16 / 9,
        background: false
      });
    }
    reader.readAsDataURL(event.target.files[0]);
  }
});


$("#imageUploadButton").click(() => {
  const canvas = cropper.getCroppedCanvas();
  if (!canvas){
    alert("Ocurrio un error. ¿Subiste el archivo correcto?");
    return;
  }

  canvas.toBlob((blob) => {
    const formData = new FormData();
    formData.append("croppedImage", blob);  

    $.ajax({
      url:'/api/users/profilePicture',
      type:"POST",
      data: formData,
      processData: false,
      contentType: false,
      success: () => location.reload()
    })

  })
});

$("#coverPhotoUploadButton").click(() => {
  const canvas = cropper.getCroppedCanvas();
  if (!canvas){
    alert("Ocurrio un error. ¿Subiste el archivo correcto?");
    return;
  }

  canvas.toBlob((blob) => {
    const formData = new FormData();
    formData.append("croppedImage", blob);  

    $.ajax({
      url:'/api/users/coverPhoto',
      type:"POST",
      data: formData,
      processData: false,
      contentType: false,
      success: () => location.reload()
    })

  })
});

$("#createChatButton").click(() => {
  const data = JSON.stringify(selectedUsers);
  $.post("/api/chats", {usuarios: data}, chat => {
    if (!chat || !chat._id) return alert("Hubo un error creando el chat");
    window.location.href = `/messages/${chat._id}`;
  })
});


$(document).on("click", ".followButton", (event) => {
  const button = $(event.target);
  const userId = button.data().user;

  axios
  .put(`/api/users/${userId}/follow`)
  .then((data) => {
    var difference = 1;
    if (data.data.siguiendo.includes(userId)){
      button.addClass("following");
      button.text("Siguiendo");
    }
    else {
      button.removeClass("following");
      button.text("Seguir");
      difference= -1;
    }

    const followersLabel = $("#followersValue");
    if (followersLabel.length !== 0){
      let followersText = followersLabel.text();
      followersText = parseInt(followersText);
      followersLabel.text(followersText + difference);
    }
  })
  .catch((error) => {
    console.log(error);
  });

});

// Se maneja distinto el click, ya que el likeButton es un elemento dinamico, se maneja a nivel document
$(document).on("click", ".likeButton", (event) => {
  const boton = $(event.target);
  const id = getElementId(boton);

  axios
    .put(`/api/posts/${id}/like`)
    .then((data) => {
      boton.find("span").text(data.data.likes.length || "");

      // Chequear si el usuario likeo el post
      if (data.data.likes.includes(userLoggedIn._id)) {
        boton.addClass("active");
      } else {
        boton.removeClass("active");
      }
    })
    .catch((error) => {
      console.log(error);
    });
});

// Redweet
$(document).on("click", ".redweetButton", (event) => {
  const boton = $(event.target);
  const id = getElementId(boton);
  axios
    .post(`/api/posts/${id}/redweet`)
    .then((data) => {
      boton.find("span").text(data.data.redweetsUsers.length || "");

      // Chequear si el usuario likeo el post
      if (data.data.redweetsUsers.includes(userLoggedIn._id)) {
        boton.addClass("active");
      } else {
        boton.removeClass("active");
      }
    })
    .catch((error) => {
      console.log(error);
    });
});

$(document).on("click", ".post", (event) => {
  const element = $(event.target);
  const id = getElementId(element);

  // !element.is(Button) == el elemento no es un tipo button
  if (id !== undefined && !element.is("button")) {
    window.location.href = '/post/' + id
  }
});

const getElementId = (element) => {
  const esRoot = element.hasClass("post");
  const rootElement = esRoot ? element : element.closest(".post");
  const id = rootElement.data().id;

  return id;
};

const createPostHtml = (data, largeFont = false) => {
  if (data.contenido === undefined) {
    data = data.data;
  }

  // Es un RD si posee el objeto RedweetData
  const isRedweet = data.redweetData !== undefined;
  const redweetAutor = isRedweet ? data.autor.usuario : null;
  data = isRedweet ? data.redweetData : data;

  const autor = data.autor;
  const timestamp = calculadoraTiempo(new Date(), new Date(data.createdAt));

  const likeButtonActiveClass = data.likes.includes(userLoggedIn._id)
    ? "active"
    : "";
  const redweetButtonActiveClass = data.redweetsUsers.includes(userLoggedIn._id)
    ? "active"
    : "";
  var largeFontClass = largeFont ? "largeFont" : "";

  let redweetText = "";

  if (isRedweet) {
    redweetText = `<span>
   <i class='fas fa-retweet'></i>
   Retweeted by <a href='/profile/${redweetAutor}'>@${redweetAutor}</a>    
</span>`;
  }

  var respuestaFlag = "";
  if (data.respondeA){
    const respondeAUsername = data.respondeA.autor.usuario;
    respuestaFlag = `<div class='respuestaFlag'> Responde a <a href='/profile/${respondeAUsername}'>@${respondeAUsername}</a> </div>`;
  }

  //Mostrar boton para borrar Dwit
  let buttons = "";
  let dataTarget = "#confirmPinModal"
  let pinnedPostText = "";
  if (data.autor._id === userLoggedIn._id) {
    let pinnedClass = "";

    if(data.pinned){
      pinnedClass = "active";
      dataTarget = "#unpinModal";
      pinnedPostText = "<i class='fas fa-thumbtack'></i> <span>Dwit Pinned</span>";
    }

    buttons = `<button class='pinButton ${pinnedClass}' data-id="${data._id}" data-toggle="modal" data-target="${dataTarget}"><i class='fas fa-thumbtack'></i></button>
    <button data-id="${data._id}" data-toggle="modal" data-target="#borrarModal"><i class='fas fa-times'></i></button>`;
  }

  return `<div class="post ${largeFontClass}" data-id='${data._id}'>
  <div class="postActionContainer">
  ${redweetText}
  </div>
  <div class="mainContentContainer">
  <div class="imagenUsuarioContainer">
  <img src='${autor.foto}'>
  </div>
  <div class="postContentContainer">
  <div class="pinnedPostText">${pinnedPostText} </div>
  <div class="header">
    <a class="displayName" href='/profile/${autor.usuario}'>${
    autor.displayName
  }</a>
    <span class="usuario">@${autor.usuario}</span>
    <span class="date">${timestamp}</span>
    ${buttons}
  </div>
  ${respuestaFlag}
  <div class="postBody">
    <span>${data.contenido}</span>
  </div>
  <div class="postFooter">
  <div class="containerActions">
  <div class="postBotonesContainer green"> 
  <button data-toggle='modal' data-target="#responderModal">
  <i class="far fa-comment-alt"></i>
  </button> 
  </div>
  <div class="postBotonesContainer green">  
  <button class='redweetButton ${redweetButtonActiveClass}'>
  <i class="fas fa-retweet"></i>
  <span>${data.redweetsUsers.length || ""}</span>
  </button></div>
 <div class="postBotonesContainer red">
 <button class='likeButton ${likeButtonActiveClass}'>
  <i class="far fa-heart"></i>
  <span>${data.likes.length || ""}</span>
  </button> </div>
  
  </div>
  </div>
  </div>
  </div>
  </div>`;
};

// Calculamos el tiempo de cada dwit
const calculadoraTiempo = (current, previous) => {
  var msPerMinute = 60 * 1000;
  var msPerHour = msPerMinute * 60;
  var msPerDay = msPerHour * 24;
  var msPerMonth = msPerDay * 30;
  var msPerYear = msPerDay * 365;

  var elapsed = current - previous;

  if (elapsed < msPerMinute) {
    if (elapsed / 1000 < 30) return "Hace un momento";

    return "Hace " + Math.round(elapsed / 1000) + " segundos";
  } else if (elapsed < msPerHour) {
    return "Hace " + Math.round(elapsed / msPerMinute) + " minutos";
  } else if (elapsed < msPerDay) {
    return "Hace " + Math.round(elapsed / msPerHour) + " horas";
  } else if (elapsed < msPerMonth) {
    return "Hace " + Math.round(elapsed / msPerDay) + " dias";
  } else if (elapsed < msPerYear) {
    return "Hace " + Math.round(elapsed / msPerMonth) + " meses";
  } else {
    return "Hace " + Math.round(elapsed / msPerYear) + " años";
  }
};

const outputPosts = (resultados, container) => {
  container.html(""); // Vaciar contenedor
  if (!Array.isArray(resultados)) {
    resultados = [resultados];
  }
  resultados.forEach((resultado) => {
    const html = createPostHtml(resultado);
    container.append(html);
  });

  if (resultados.length == 0) {
    container.append("<span class='vacio'>No hay Dwits encontrados</span>");
  }
};

// Obtener las respuestas de un mismo dwit aunque no sean nuestras
const outputPostsWithReplies = (resultados, container) => {
  container.html(""); // Vaciar contenedor

  // Validaciones
  if (resultados.respondeA !== undefined && resultados.respondeA._id !== undefined) {
    let html = createPostHtml(resultados.respondeA);
    container.append(html);
  }

  const mainHtml = createPostHtml(resultados.postData, true);
  container.append(mainHtml);

  resultados.respuestas.forEach((resultado) => {
    let html = createPostHtml(resultado);
    container.append(html);
  });

  if (resultados.length == 0) {
    container.append("<span class='vacio'>No hay Dwits encontrados</span>");
  }
};

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

const searchUsers = (searchTerm) => {
  $.get("/api/users", {search: searchTerm}, results => {
    outputSelectableUsers(results, $(".resultsContainer"));
  })
}

const outputSelectableUsers = (results, container) => {
  container.html("");
  results.forEach(result => {
    // No queremos mostrarnos a nosotros mismos como resultado o ya esta seleccionado
    if (result._id == userLoggedIn._id || selectedUsers.some(u => u._id == result._id)){
      return;
    }
    const html = createUserHtml(result, false);
    const element = $(html);
    element.click(() => userSelected(result));
    container.append(element);

      if (!results.length){
          container.append("<span class='noResults'>No se encontraron resultados</span>")
      }
  });

}

const userSelected = (user) => {
  selectedUsers.push(user);
  updateSelectedUsersHtml();
  // Limpiamos el input
  $("#userSearchTextbox").val("").focus();
  // Limpiamos los resultados
  $(".resultsContainer").html("");
  $("#createChatButton").prop("disabled", false);
}

const updateSelectedUsersHtml = () => {
  let elements = [];
  selectedUsers.forEach(user => {
    const usuario = user.usuario;
    const userElement = $(`<span class="selectedUser">${usuario}</span>`);
    elements.push(userElement);
  })

  $(".selectedUser").remove();
  $("#selectedUsers").prepend(elements);
}