const express = require("express");
const socket = require('socket.io');
const app = express();
let server = app.listen(80);
console.log('The server is now running at http://localhost/');
app.use(express.static("public"));


let io = socket(server);
const MINPLAYERS = 1;
const MAXPLAYERS = 2;
const TIMERLENGTH = 3600;

let PowerUp = require("./PowerUp");
let Player = require("./Player");
let Board = require("./Board");

const gameStates = {
	init: "init",
	game: "game",
	results: "results"
}
const splatNames = ["Pinky", "Greg"];
const splatColors = [{r: 254, g: 135, b: 209}, {r: 166, g: 198, b: 82}];

let gameState = gameStates.init;
let timer = 0;

let players = [];
let playersSockets = {};

let boardSize = {x:50, y:50};
let board = new Board(boardSize);
let colormap = new Map();

setInterval(updateGame, 13);
setInterval(sendBoard, 250);
setInterval(updatePlayers, 20);

io.sockets.on("connection", socket => {
  if(players.length < MAXPLAYERS && gameState == gameStates.init) {
    let playerNumber = players.length%splatNames.length;
    
    players.push(new Player(socket.id, playerNumber, splatNames[playerNumber],
                            0.5, 0.5, 0.05, splatColors[playerNumber]));
    
    playersSockets[socket.id]=socket;
    colormap.set(socket.id, splatColors[playerNumber]);
    socket.emit("boardSize", boardSize);
    console.log(`New connection ${socket.id}`);

    socket.on('move', function (coords) {
      let player = getPlayer(socket.id);

      player.move(coords);
    });
    
    socket.on('ready', function (data) {
      let player = getPlayer(socket.id);

      player.ready = true;
    });
    
    socket.on('reset', function (data) {
      resetGame();
    });
    
    socket.on('resetTimer', function (data) {
      if(gameState == gameStates.game)
        timer = 60;
    });
    
    socket.on('fillBoard', function (data) {
      board.claim(players[0], 0, 0, 10);
    });
    
    socket.on("disconnect", reason => {
      console.log("Closed connection "+ socket.id);
      io.sockets.emit("disconnect", socket.id);
      players = players.filter(player => player.id !== socket.id);
    });
  }
  else {
    socket.emit("notAvailable", socket.id);
  }
});

function resetGame() {
  gameState = gameStates.init;
  
  board = new Board(boardSize);
  
  for (let i = 0; i < players.length; i++) {
    let player = players[i];
    
    player.y = 0.5;
    player.x = (0.1+i*0.8)%1;
    player.radius = player.initialRadius;
    
    player.ready = false;
  }
  
  console.log("Game reset");
}

function updateGame() {
  
  if(players.length == 0 && gameState != gameStates.init) {
    resetGame();
  }
  if(gameState == gameStates.results) {
    resetGame();
  }
  
  // Update init state
  if(gameState == gameStates.init) {
    let numOfReadyPlayers = 0;
    for (let i = 0; i < players.length; i++) {
      if(players[i].ready) {
        players[i].number = numOfReadyPlayers;
        players[i].name = splatNames[numOfReadyPlayers%splatNames.length];
        players[i].color = splatColors[numOfReadyPlayers%splatColors.length];
        colormap.set(players[i].id, players[i].color);
        numOfReadyPlayers += 1;
      }
    }
    
    if(numOfReadyPlayers >= MINPLAYERS &&
       numOfReadyPlayers >= players.length) {
        gameState = gameStates.game;
        timer = TIMERLENGTH;
    }
  }
  
  // Update game state
  if(gameState == gameStates.game) {
    
    if(Math.floor(Math.random() * PowerUp.POWERUP_FREQUENCY) == 0) {
      board.spawnRandomPowerUp();
    }
    
    for (let i = 0; i < players.length; i++) {
      let player = players[i];
      board.claim(player, player.x, player.y, player.radius);
      player.update();
      board.update();
    }
    
    if(timer > 0)
      timer -= 1;
    
    if(timer <= 0 || players.length < MINPLAYERS) {
      gameState = gameStates.results;
      sendScores();
    }
  }
  
  io.sockets.emit("heartbeat", {state:gameState, timer:timer});
}

function updatePlayers() {
  io.sockets.emit("updatePlayers", {players: players});
}

function sendBoard() {
  if(gameState == gameStates.game) {
    let jsonMap = JSON.stringify(Array.from(colormap));
    let jsonPowerUps = JSON.stringify(board.powerUps);
    io.sockets.emit("updateBoard", {board:board.board, powerUps: jsonPowerUps, colormap:jsonMap});
  }
}

function sendScores() {
  scores = JSON.stringify(Array.from(board.calculateScores()));
  io.sockets.emit("updateScores", scores);
}

function getPlayer(id) {
  for (let i = 0; i < players.length; i++) {
    if (players[i].id === id) {
      return players[i];
    }
  }
  return null;
}
