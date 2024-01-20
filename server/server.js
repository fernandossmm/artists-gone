const express = require("express");
const socket = require('socket.io');
const app = express();
const MAXPLAYERS = 2;

let Player = require("./Player");
let Board = require("./Board");

let server = app.listen(80);
console.log('The server is now running at http://localhost/');
app.use(express.static("public"));

let io = socket(server);

let players = [];
let playersSockets = {};

let boardSize = {x:40, y:25};
let board = new Board(boardSize);

setInterval(updateGame, 16);
setInterval(sendBoard, 100);

io.sockets.on("connection", socket => {
  if(players.length < MAXPLAYERS)
  {
    players.push(new Player(socket.id, 0.5, 0.5, 0.05));
    playersSockets[socket.id]=socket;
    socket.emit("boardSize", boardSize);
    console.log(`New connection ${socket.id}`);

    socket.on('move', function (data) {
      let player = getPlayer(socket.id);

      player.move(data.direction);
    });
    
    socket.on('released', function (data) {
      
    });
    
    socket.on('reset', function (data) {
      board = new Board(boardSize);
    });
    
    socket.on("disconnect", reason => {
      console.log("Closed connection "+ socket.id);
      io.sockets.emit("disconnect", socket.id);
      players = players.filter(player => player.id !== socket.id);
    });
  }
  else
  {
    socket.emit("notAvailable", socket.id);
  }
});

function updateGame() {
  for (let i = 0; i < players.length; i++) {
    board.claim(players[i].x, players[i].y, players[i].radius, players[i].id);
  }
  
  io.sockets.emit("heartbeat", players);
}

function sendBoard() {
  io.sockets.emit("updateBoard", board.board);
}

function getPlayer(id) {
  for (let i = 0; i < players.length; i++) {
    if (players[i].id === id) {
      return players[i];
    }
  }
  return null;
}
