const allPlayers = (playerName) => {
  fetch(
    `https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${playerName}`
  )
    .then((res) => res.json())
    .then((data) => {
      displayPlayers(data);
      console.log(data);
    });
};

allPlayers("af");

const displayPlayers = (data) => {
  const playersContainer = document.getElementById("players-container");
  playersContainer.innerHTML = "";

  if (data.player) {
    data.player.forEach((player) => {
      const playerDiv = document.createElement("div");
      playerDiv.classList.add("col");
      playerDiv.innerHTML = `
                <div class="card bg-success ">
                    <img src="${player.strThumb}" class="card-img-top  alt="${player.strPlayer}" >
                    <div class="card-body">
                        
                        <div class="d-flex justify-content-between align-items-center mb-1">
                            <div>
                                <h3 class=" text-white">${player.strPlayer}</h3>
                            </div>    
                        </div>
                        
                        <h6 class="text-white " >Nationality : ${player.strNationality}</h6>
                        <h6 class="text-white ">Sports : ${player.strSport} </h6>
                        <h6 class="text-white ">Position: ${player.strPosition} </h6>
                        
                        <div>
                            <a href=${player.strInstagram} target="_blank" class="text-white m-1"><i class="fa-brands fa-instagram fa-2x"></i></a>
                            <a href=${player.strTwitter}  target="_blank" class="text-white m-1"><i class="fa-brands fa-twitter fa-2x"></i></i></a>
                        </div>
                    </div>
                    <div class="card-footer d-flex align-items-center justify-content-between">
                        <button  onclick="singlePlayer('${player.idPlayer}')"  class="btn btn-outline-light " data-bs-toggle="modal" data-bs-target="#exampleModal"> Details </button>
                        <button id="add-player-button-${player.idPlayer}" onclick="addSinglePlayer('${player.idPlayer}')"  class="btn btn-outline-light " > Add To Team </button>
                    </div>
                </div>
            `;
      playersContainer.appendChild(playerDiv);
    });
  } else {
    playersContainer.innerHTML = `
            <div class="alert alert-danger" role="alert">
                NO PLAYER FOUND!
            </div>
        `;
  }
};

const handleSearch = (event) => {
  event.preventDefault();
  const playerName = document.getElementById("searchInput").value;
  if (playerName) {
    allPlayers(playerName);
  } else {
    document.getElementById("players-container").innerHTML = "";
  }
  document.getElementById("searchInput").value = "";
};

document.getElementById("searchForm").addEventListener("submit", handleSearch);

document
  .getElementById("searchInput")
  .addEventListener("input", function (event) {
    const playerName = event.target.value;
    if (playerName) {
      allPlayers(playerName);
    } else {
      document.getElementById("players-container").innerHTML = "";
    }
  });

const singlePlayer = (id) => {
  fetch(`https://www.thesportsdb.com/api/v1/json/3/lookupplayer.php?id=${id}`)
    .then((res) => res.json())
    .then((data) => {
      viewSingleProduct(data.players[0]);
    });
};

const viewSingleProduct = (player) => {
  const title = document.getElementById("single-player-title");
  const body = document.getElementById("single-player-body");
  title.innerText = player.strPlayer;

  body.innerHTML = `
    <div class="card " ">
        <div class="row bg-dark g-0">
            <div class="col-md-4 d-flex justify-content-center align-items-center">
                <img src=${
                  player.strThumb
                } class="img-fluid rounded-start" alt="...">
            </div>
            
            <div class="col-md-8">
                <div class="card-body">
                    <h6 class="card-title text-white">Birth Location: ${
                      player.strBirthLocation
                    } </h6>
                    <p class="card-title text-white">Nationality: ${
                      player.strNationality
                    } </p>
                    <p class="card-title text-white">Team: ${
                      player.strTeam
                    } </p>
                    <p class="card-title text-white">Sports: ${
                      player.strSport
                    } </p>
                    <p class="card-title text-white">Height: ${
                      player.strHeight
                    } </p>
                    <p class="card-title text-white">Gender: ${
                      player.strGender
                    } </p>
                    <p class="text-white">Description: ${player.strDescriptionEN.slice(
                      0,
                      200
                    )}</p>
                </div>
            </div>
        </div>
    </div>
    `;
};

const addSinglePlayer = (id) => {
  fetch(`https://www.thesportsdb.com/api/v1/json/3/lookupplayer.php?id=${id}`)
    .then((res) => res.json())
    .then((data) => {
      handleAddToTeam(data.players[0]);
    });
};

let addedPlayers = [];
document.getElementById("added-players-qunatity").innerText = 0;

const handleAddToTeam = (player) => {
  if (addedPlayers.length < 11) {
    if (addedPlayers.some((p) => p.idPlayer === player.idPlayer)) {
      alert("");
    } else {
      addedPlayers.push(player);
      document.getElementById(
        `add-player-button-${player.idPlayer}`
      ).disabled = true;
      document.getElementById(
        `add-player-button-${player.idPlayer}`
      ).innerText = "Player Already Added";
      viewAddedPlayers();
    }
  } else {
    alert("You can add only 11 player");
  }
};

const viewAddedPlayers = () => {
  document.getElementById("added-players-qunatity").innerText =
    addedPlayers.length;

  const addedPlayersContainer = document.getElementById(
    "added-players-container"
  );
  addedPlayersContainer.innerHTML = "";

  if (addedPlayers) {
    addedPlayers.forEach((player) => {
      const playerDiv = document.createElement("div");
      playerDiv.classList.add("col");

      document
        .getElementById("added-players-container")
        .classList.add("border", "border-success", "me-3");

      playerDiv.innerHTML = `
                        <div class="d-flex justify-content-between align-items-center mb-1">
                            <div>
                                <h3 class="text-success">${player.strPlayer}</h3>
                            </div>
                            <button onclick="removeFormTeam('${player.idPlayer}')" class="btn btn-danger btn-sm">Remove</button>
                        </div>
            `;
      addedPlayersContainer.appendChild(playerDiv);
    });
  }
};

const removeFormTeam = (playerID) => {
  addedPlayers = addedPlayers.filter((player) => player.idPlayer != playerID);
  document.getElementById(`add-player-button-${playerID}`).disabled = false;
  document.getElementById(`add-player-button-${playerID}`).innerText =
    "Add To Team";
  viewAddedPlayers();
};
