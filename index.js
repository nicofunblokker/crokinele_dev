var playerInputsDiv = document.getElementById("player-inputs");
var addPlayerButton = document.getElementById("add-player-button");
var calculateResultsButton = document.getElementById("calculate-results-button");
var calculateTotalButton = document.getElementById("calculate-total-button");
var resultsTable = document.getElementById("results");

var players = [];
var round = 0;

function addPlayer() {
  var playerCount = document.getElementById("playerCount").value;
  var playerInputsDiv = document.getElementById("playerInputs");

  while (playerInputsDiv.childNodes.length > 0) {
    playerInputsDiv.removeChild(playerInputsDiv.childNodes[0]);
  }

  for (var i = 0; i < playerCount; i++) {
    var playerRow = document.createElement("div");
    playerRow.style.display = "flex";
    playerRow.style.alignItems = "center";
    playerRow.style.marginBottom = "10px";

    var playerLabel = document.createElement("label");
    playerLabel.innerHTML = "Player " + (i + 1) + " Name:";
    playerLabel.style.marginRight = "10px";
    playerRow.appendChild(playerLabel);

    var playerInput = document.createElement("input");
    playerInput.type = "text";
    playerInput.classList.add("player-input");
    playerInput.style.marginRight = "10px";
    playerRow.appendChild(playerInput);

    var scoreLabel = document.createElement("label");
    scoreLabel.innerHTML = "Score:";
    scoreLabel.style.marginRight = "10px";
    playerRow.appendChild(scoreLabel);

    var scoreInput = document.createElement("input");
    scoreInput.type = "number";
    scoreInput.classList.add("player-input");
    playerRow.appendChild(scoreInput);

    playerInputsDiv.appendChild(playerRow);
  }
}

function calculateResults() {
  var round = localStorage.getItem("round") || 1;
  round++;
  var results = document.getElementById("results");
  var scores = [];
  var playerInputs = document.querySelectorAll(".player-input");
  for (var i = 0; i < playerInputs.length; i += 2) {
  var playerNames = ["red", "blue", "white", "black"];
  if (playerInputs[i].value === "") {
      playerInputs[i].value = playerNames[i/2 % playerNames.length];
    }
  }
  for (var i = 1; i < playerInputs.length; i += 2) {
    scores.push(playerInputs[i].value);
  }
  var maxScore = Math.max(...scores);
  for (var i = 0; i < playerInputs.length; i += 2) {
    var row = results.insertRow();
    var roundCell = row.insertCell(0);
    var playerCell = row.insertCell(1);
    var scoreCell = row.insertCell(2);
    roundCell.innerHTML = round;
    playerCell.innerHTML = playerInputs[i].value;
    scoreCell.innerHTML = playerInputs[i + 1].value;
    if (playerInputs[i + 1].value == maxScore) {
      row.classList.add("winner");
    }
  }
  localStorage.setItem("results", results.innerHTML);
  localStorage.setItem("round", round);
}


addPlayerButton.addEventListener("click", function () {
  addPlayer();
});

calculateResultsButton.addEventListener("click", function () {
  calculateResults();
});

var newRoundButton = document.getElementById("new-round-button");

function startNewRound() {
  for (var i = 0; i < players.length; i += 2) {
    players[i + 1].value = "";
  }
  var results = document.getElementById("results");
  results.innerHTML = localStorage.getItem("results");
  round = parseInt(localStorage.getItem("round")) || 0;
}

newRoundButton.addEventListener("click", function () {
  startNewRound();
});

var deleteRoundButton = document.getElementById("delete-round-button");

  function deleteRound() {
    let table = document.getElementById("results");
    let rows = table.rows;
    let lastRow = rows[rows.length - 1];
    let lastRowValue = lastRow.cells[0].innerHTML;

    for (let i = rows.length-1; i > 0; i--) {
      let row = rows[i];
      if (row.cells[0].innerHTML === lastRowValue) {
        table.deleteRow(i);
      }
    }

    if(round > 1) {
      round--;
    }
    localStorage.setItem("round", round);
  }


deleteRoundButton.addEventListener("click", function () {
  deleteRound();
});


function calculateTotal() {
  let table = document.getElementById("results");
  let rows = table.rows;
  let sums = {};
  let maxScore = 0;
  let maxScoreRow;

  for (let i = 1; i < rows.length; i++) {
    let row = rows[i];
    let group = row.cells[1].innerHTML;
    let score = parseInt(row.cells[2].innerHTML);
    if (!sums[group]) {
      sums[group] = 0;
    }
    sums[group] += score;
  }

  let groups = Object.keys(sums);
  for (let i = 0; i < groups.length; i++) {
    let group = groups[i];
    let sum = sums[group];
    let newRow = table.insertRow(rows.length);
    let groupCell = newRow.insertCell(0);
    groupCell.innerHTML = "Total";
    let nameCell = newRow.insertCell(1);
    nameCell.innerHTML = group;
    let sumCell = newRow.insertCell(2);
    sumCell.innerHTML = sum;

    if (sum > maxScore) {
      maxScore = sum;
      maxScoreRow = newRow;
    }
  }

  if (maxScoreRow) {
    maxScoreRow.style.backgroundColor = "red";
  }
}

calculateTotalButton.addEventListener("click", function () {
  calculateTotal();
  //particlesJS();
});

function reset() {
    localStorage.clear();
    location.reload();
    localStorage.setItem("round", 0);
}

var resetButton = document.getElementById("reset-button");

resetButton.addEventListener("click", function () {
  reset();
});
particlesJS("particles-js", {
    particles: {
      number: {
        value: 100,
        density: {
          enable: true,
          value_area: 800
        }
      },
      color: {
        value: "#ffffff"
      },
      shape: {
        type: "circle",
        stroke: {
          width: 0,
          color: "#000000"
        },
        polygon: {
          nb_sides: 5
        },
        image: {
          src: "img/github.svg",
          width: 100,
          height: 100
        }
      },
      opacity: {
        value: 0.5,
        random: false,
        anim: {
          enable: false,
          speed: 1,
          opacity_min: 0.1,
          sync: false
        }
      },
      size: {
        value: 3,
        random: true,
        anim: {
          enable: false,
          speed: 40,
          size_min: 0.1,
          sync: false
        }
      },
      line_linked: {
        enable: true,
        distance: 150,
        color: "#ffffff",
        opacity: 0.4,
        width: 1
      },
      move: {
        enable: true,
        speed: 6,
        direction: "none",
        random: false,
        straight: false,
        out_mode: "out",
        bounce: false,
        attract: {
          enable: false,
          rotateX: 600,
          rotateY: 1200
        }
      }
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: {
          enable: true,
          mode: "repulse"
        },
        onclick: {
          enable: true,
          mode: "push"
        },
        resize: true
      },
      modes: {
        grab: {
          distance: 400,
          line_linked: {
            opacity: 1
          }
        },
        bubble: {
          distance: 400,
          size: 40,
          duration: 2,
          opacity: 8,
          speed: 3
        },
        repulse: {
          distance: 200,
          duration: 0.4
        },
        push: {
          particles_nb: 4
        },
        remove: {
          particles_nb: 2
        }
      }
    },
});
