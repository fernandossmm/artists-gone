// ARTIST'S GONE

p5.disableFriendlyErrors = true;

var socket;

var timer;

var playerId;
var players = [];

var board;
var colormap;
var results;
var resultsBoard;

var available = true;
var x = 0;
var y = 0;

var readyButton;
var finishButton;

const gameStates = {
	init: "init",
	game: "game",
	results: "results"
}
let gameState = gameStates.init;

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

var playerImages = [];
var backgroundImages = new Map();

function preload() {
  playerImages.push(loadImage('assets/player1.png'));
  playerImages.push(loadImage('assets/player2.png'));
  backgroundImages.set("wood", loadImage('assets/background.jpg'));
}

function setup() {
  createCanvas(WIDTH, HEIGHT);
  frameRate()
  
  socket = io.connect('http://localhost'); // frajelly.raspberryip.com | localhost
  socket.on('connect', () => {
    playerId = socket.id; // an alphanumeric id
    $("#loader").fadeOut("slow");
  });
  setBoardSize(1);
  
  readyButton = new Button(WIDTH*0.4, HEIGHT*0.6, WIDTH*0.2, HEIGHT*0.1, "Ready?");
  finishButton = new Button(WIDTH*0.4, HEIGHT*0.6, WIDTH*0.2, HEIGHT*0.1, "Play again!");
  
  socket.on("notAvailable", (x) => notAvailable());
  
  /// Client events
  socket.on("heartbeat", data => heartbeat(data));
  socket.on("updateBoard", data => updateBoard(data));
  socket.on("updateScores", scores => updateScores(scores));
  socket.on("color", color => setColor(color));
  socket.on("boardSize", size => setBoardSize(size));
  socket.on("showMessage", message => alert(message));
  socket.on("disconnect", playerId => removePlayer(playerId));
}

function draw() {
  if(gameState == gameStates.init) {
    showInit();
  }
  else if(gameState == gameStates.game) {
    showGame();
    
    updateGame();
  }
  else if(gameState == gameStates.results) {
    showResults();
  }
}

////////////////////////////////////////////////////////////////// VISUALS

function showInit() {
  background(0,0,40);
  
  image(backgroundImages.get("wood"), 0,0, WIDTH, HEIGHT);
  
  readyButton.draw();
}

function showGame() {
  background(120,120,120);
  
  drawBoard(board);
  
  for (let i = 0; i < players.length; i++) {
    players[i].draw();
  }
  
  drawTimer();
}

function drawTimer() {
  push();
  textSize(HEIGHT/20);
  textAlign(CENTER);
  textStyle(BOLD);
  fill(0);
  strokeWeight(4);
  text(Math.ceil(timer/60), 0, 0, WIDTH, HEIGHT*0.1);
  pop();
}

function drawFPS() {
  push();
  textSize(HEIGHT/20);
  textAlign(CENTER);
  fill(50);
  strokeWeight(4);
  text(int(frameRate()), WIDTH*0.8, 0, WIDTH*0.2, HEIGHT*0.1);
  pop();
}

function drawBoard(board) {
  if(board != null && colormap != null && colormap.size > 0)
    board.draw(colormap);
}

function showResults() {
  background(120,120,120);
  
  if(resultsBoard != undefined)
    drawBoard(resultsBoard);
  
  push();
  fill(0, 0, 0, 100);
  rect(WIDTH*0.3, HEIGHT*0.2, WIDTH*0.4, HEIGHT*0.6);
  textSize(HEIGHT/40);
  textAlign(CENTER);
  fill(255);
  strokeWeight(4);
  
  // Title
  text("And the winner is...", WIDTH*0.35, HEIGHT*0.3, WIDTH*0.3, HEIGHT*0.1);
  
  var sorted = Array.from(results).sort((a, b) => b[1] - a[1]);
  // Winner
  textSize(HEIGHT/20);
  text(getPlayer(sorted[0][0]).name+": "+Math.round(sorted[0][1]*100)+"%",
                  WIDTH*0.35, HEIGHT*0.4, WIDTH*0.3, HEIGHT*0.1);
  
  // Other(s)
  textSize(HEIGHT/40);
  for(var i=1; i < sorted.length; i++) {
    if(sorted[i][1] != undefined)
      text(getPlayer(sorted[i][0]).name+": "+Math.round(sorted[i][1]*100)+"%",
            WIDTH*0.35, HEIGHT*0.45+i*HEIGHT*0.05, WIDTH*0.3, HEIGHT*0.1);
  }
  pop();
  
  finishButton.draw();
}

////////////////////////////////////////////////////////////////// LOGIC UPDATES

function heartbeat(data) {
  setState(data.state);
  
  timer = data.timer;
  
  updatePlayers(data.players);
}

function setState(newGameState, force) {
  if(gameState != gameStates.results || force)
    gameState = newGameState;
}

function updateGame() {
  processMove();
}

function processMove() {
  let player = getPlayer(playerId);
  
  if(board != null && player != null) {
    let direction = {x:(mouseX*1.0/WIDTH-player.x),
                     y:(mouseY*1.0/HEIGHT-player.y)};
    var move = {direction: direction};
    
    // This updates the player position before it comes back from the server, sort of a prediction
    player.move(direction);
    
    socket.emit('move', move);
    
    // This shows claimed spots for the player before they come back from the server
    board.claim(player.x, player.y, player.radius, player.id);
  }
}

////////////////////////////////////////////////////////////////// PLAYERS LOGIC

function updatePlayers(serverPlayers) {
  for (let i = 0; i < serverPlayers.length; i++) {
    let playerFromServer = serverPlayers[i];
    if (!playerExists(playerFromServer)) {
      players.push(new Player(playerFromServer, playerImages[i%playerImages.length]));
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

////////////////////////////////////////////////////////////////// BOARD LOGIC
function setBoardSize(size) {
  board = new Board(size);
}

function updateBoard(data) {
  board.update(data.board);
  colormap = new Map(JSON.parse(data.colormap));
}

function updateScores(scores) {
  results = new Map(JSON.parse(scores));
  resultsBoard = new Board(board.size);
  resultsBoard.update(board.board);
}

////////////////////////////////////////////////////////////////// MOUSE EVENTS

function mousePressed() {
  if(available) {
    if (readyButton.isMouseInside() && gameState == gameStates.init) {
      socket.emit('ready');
      
      readyButton.text ="Ready!";
    }
    if (finishButton.isMouseInside() && gameState == gameStates.results) {
      setState(gameState.init, true);
      
      readyButton.text ="Ready?";
    }
  }
}

function keyPressed(){
  if(available) {
    if (key == ' ') { //this means space bar, since it is a space inside of the single quotes 
      socket.emit('reset');
    }
    if (key == 'x') { //this means space bar, since it is a space inside of the single quotes 
      socket.emit('resetTimer');
    }
    if (key == 'f') { //this means space bar, since it is a space inside of the single quotes 
      socket.emit('fillBoard');
    }
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
  push();
  fill(230,230,230, 100);
  stroke(230,230,230, 150);
  rect(this.x,this.y,this.width,this.height);
  textSize(this.width/10);
  textAlign(CENTER, CENTER);
  fill(40,40,40, 220);
  stroke(0,0,0,0);
  text(this.text, this.x, this.y, this.width, this.height);
  stroke(230,230,230, 40);
  pop();
}

Button.prototype.isMouseInside = function() {
  return mouseX > this.x &&
         mouseX < (this.x + this.width) &&
         mouseY > this.y &&
         mouseY < (this.y + this.height);
};