// using queryselector select the input, pull button and user container and assign them to variables
const userInput = document.querySelector(".ms-input");
const pullBtn = document.querySelector(".ms-btn--pull");
let userContainer = document.querySelector(".ms-user__container");

//callback function after the pull info button is clicked
function handleClick() {
  //display loading while the data is being fetched
  userContainer.innerHTML = `<div class="ms-loading"></div><p>Loading...</p>`;

  //get value from the input field
  const username = userInput.value;

  //Github api usedto query
  const url = "https://api.github.com/users/" + username;

  //fetch method of ES6 that takes mandatory onw argument(i.e. the url)
  fetch(url)
    .then(data => data.json()) //convert the data into json format
    .then(user => {
      //if username is not entered or the user name doesn't exist then display not found
      if (username === "" || user.message === "Not Found") {
        // console.log(user.message);
        userContainer.innerHTML = `<h2 class="ms-info">No Information Found</h2>`;
      } else {
        console.log(user);
        //html with user data
        var html = `
                  <img class="ms-user__image" src=${user.avatar_url}/>
                  <h2 class="ms-username">${
                    user.name ? user.name : user.login
                  }</h2>
                  <h4 class="ms-user__url"> <a href="${
                    user.html_url
                  }" target="_blank">@${user.login}</a></h4>
                  <p class="ms-repo__count">Total Repo: ${user.public_repos}</p>
                  <p class="ms-followers">Followers: ${user.followers}</p>
                  <p class="ms-following">Following: ${user.following}</p>
                  <h3 class="ms-bio">Bio:</h3>
                  <p>${user.bio? user.bio:"No bio found"}</p>
                  <h3 class="ms-repo">Repositories:</h3>`;

        //again fetch the repositories
        fetch(`${user.repos_url}`)
          .then(data => data.json())
          .then(repos => {
            let arr = [];

            //push data into array using spread operator
            arr.push(...repos);

            if (arr.length != 0) {
              //user higheroerder function forEach to get individual repo
              arr.forEach(repo => {
                html += `<li><a href=${repo.html_url} target="_blank">${
                  repo.name
                }</a></li>`;
              });
            } else {
                html+=`<h2 class="ms-info">No Repositories Found</h2>`
            }

            //finally append the html to the container
            userContainer.innerHTML = html;
          });
      }
    });
}

//add an event listener 'click' to the pull button
pullBtn.addEventListener("click", handleClick);

//add an event listener keypress to the input field to detect if enter is pressed
userInput.addEventListener("keypress", function(e) {
  if (e.keyCode === 13) {
    handleClick(); //call the handleClick function
  }
});
