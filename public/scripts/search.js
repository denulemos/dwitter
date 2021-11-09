let timer;
$("#searchBox").keydown((event) => {
    clearTimeout(timer);
    const textBox = $(event.target);
    let value = textBox.val();
    const searchType = textBox.data().search;

    timer = setTimeout(() => {
        value = textBox.val().trim();

        if (!value){
            $(".resultsContainer").html("");
        }
        else {
            search(value, searchType);
        }
    },1000)

})

const search = (searchTerm, searchType) => {
    const url = searchType == "users" ? "/api/users" : "/api/posts";
    $.get(url, {search: searchTerm}, (results) => {
        if (searchType == "users"){
            outputUsers(results, $(".resultsContainer"));
        }
        else {
            outputPosts(results, $(".resultsContainer"));
        }
    })
}