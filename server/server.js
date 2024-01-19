const express = require("express");
const socket = require('socket.io');
const app = express();
const MAXPLAYERS = 4;

let Player = require("./Player");

let server = app.listen(80);
console.log('The server is now running at http://localhost/');
app.use(express.static("public"));

let io = socket(server);

let players = [];
let playersSockets = {};

setInterval(updateGame, 60);

io.sockets.on("connection", socket => {
  if(players.length < MAXPLAYERS)
  {
    players.push(new Player(socket.id, 0.5, 0.5, 0.05));
    playersSockets[socket.id]=socket;
    console.log(`New connection ${socket.id}`);

    socket.on('move', function (data) {
      let player = getPlayer(socket.id)

      player.move(data.direction)
    });
    
    socket.on('released', function (data) {
      
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
  io.sockets.emit("heartbeat", players);
}

function getPlayer(id) {
  for (let i = 0; i < players.length; i++) {
    if (players[i].id === id) {
      return players[i];
    }
  }
  return null;
}
