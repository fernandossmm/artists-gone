// ARTIST'S GONE

p5.disableFriendlyErrors = true;

var socket;

var playerId;
var players = [];
var board;
var available = true;
var x = 0;
var y = 0;

var currentPosition, lastPosition;

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

function preload() {
  
}
var vol;
var samples;

function setup() {
  createCanvas(WIDTH, HEIGHT);
  frameRate()
  
  socket = io.connect('http://localhost'); // frajelly.raspberryip.com | localhost
  socket.on('connect', () => {
    playerId = socket.id; // an alphanumeric id
    $("#loader").fadeOut("slow");
  });
  socket.on("notAvailable", (x) => notAvailable());
  
  board = new Board({x:40, y:25});
  
  /// Client events
  socket.on("heartbeat", players => updatePlayers(players));
  socket.on("showMessage", message => alert(message));
  socket.on("disconnect", playerId => removePlayer(playerId));
}

function draw() {
  background(100,0,220,200);
  
  board.draw();
  
  for (let i = 0; i < players.length; i++) {
    players[i].draw();
  }

  if(getPlayer(playerId) != null) {
    let player = getPlayer(playerId)

    let direction = { x:(mouseX*1.0/WIDTH-player.x),
                      y:(mouseY*1.0/HEIGHT-player.y)}
    var move = {direction: direction};
    
    board.claim(player.x, player.y, player.radius, player.id);
    
    socket.emit('move', move);
  }
}

////////////////////////////////////////////////////////////////// BUTTONS

function Button(x,y,width,height,text){
  this.x=x;
  this.y=y;
  this.width=width;
  this.height=height;
  this.text=text;
}

Button.prototype.draw=function(){
  fill(230,230,230, 100);
  stroke(230,230,230, 150);
  rect(this.x,this.y,this.width,this.height);
  textSize(this.width/10);
  textAlign(CENTER, CENTER);
  fill(20,20,20,180);
  stroke(0,0,0,0);
  text(this.text, this.x, this.y, this.width, this.height);
  stroke(230,230,230, 40);
}

Button.prototype.isMouseInside = function() {
  return mouseX > this.x &&
         mouseX < (this.x + this.width) &&
         mouseY > this.y &&
         mouseY < (this.y + this.height);
};

////////////////////////////////////////////////////////////////// PLAYERS LOGIC

function updatePlayers(serverPlayers) {
  for (let i = 0; i < serverPlayers.length; i++) {
    let playerFromServer = serverPlayers[i];
    if (!playerExists(playerFromServer)) {
      players.push(new Player(playerFromServer));
    }
    else {
      let localPlayer = players[i]
      localPlayer.update(playerFromServer)
    }
  }
}

function playerExists(playerFromServer) {
  for (let i = 0; i < players.length; i++) {
    if (players[i].id === playerFromServer.id) {
      return true;
    }
  }
  return false;
}

function removePlayer(playerId) {
  players = players.filter(player => player.id !== playerId);
}

function getPlayer(id) {
  for (let i = 0; i < players.length; i++) {
    if (players[i].id === id) {
      return players[i];
    }
  }
  return null;
}

function notAvailable() {
  $("#notAvailable").css("visibility","visible");
  available = false;
}

function updateId(id) {
  console.log("Updating ID");
  playerId = id;
}

////////////////////////////////////////////////////////////////// MOUSE EVENTS

function mousePressed() {
  if(available)
  {
    console.log(board)
  }
}

function mouseReleased() {
  if(available) {
    
  }
}

