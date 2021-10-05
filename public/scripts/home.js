$(document).ready(() => {
    axios.get('/api/posts')
    .then((response) => {
    
    })
    .catch((error) => {
      console.log(error);
    });
})