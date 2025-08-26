// ARTIST'S GONE

p5.disableFriendlyErrors = true;

var socket;

var cutieFont;

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
var gameState = gameStates.init;

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

var splats = [];
var assets = new Map();

function preload() {
  splats.push(loadImage('assets/player1.png'));
  splats.push(loadImage('assets/player2.png'));
  assets.set("wood", loadImage('assets/background.jpg'));
  assets.set("canvas", loadImage('assets/canvas.jpg'));
  assets.set("frame", loadImage('assets/frame.png'));
  assets.set("title", loadImage('assets/title.png'));
  assets.set("button", loadImage('assets/button.png'));
  assets.set("art-top", loadImage('assets/background-top.png'));
  assets.set("art-bottom", loadImage('assets/background-bot.png'));
  assets.set("resultsFrame", loadImage('assets/resultsFrame.png'));
  assets.set("papers", loadImage('assets/papers.png'));
  assets.set("sizeUp", loadImage('assets/powerups/sizeUp.png'));
  assets.set("speedUp", loadImage('assets/powerups/speedUp.png'));
  assets.set("bomb", loadImage('assets/powerups/bomb.png'));
  
  cutieFont = loadFont('assets/CutieMolly_Regular.ttf');
}

function setup() {
  createCanvas(WIDTH, HEIGHT);
  frameRate(75);
  
  textFont(cutieFont);
  
  socket = io.connect('cosmos-8-nov.resiz.es'); // localhost
  socket.on('connect', () => {
    playerId = socket.id; // an alphanumeric id
    $("#loader").fadeOut("slow");
  });
  setBoardSize(1);
  
  readyButton = new Button(WIDTH*0.425, HEIGHT*0.62, WIDTH*0.15, HEIGHT*0.15, "Ready?");
  finishButton = new Button(WIDTH*0.425, HEIGHT*0.62, WIDTH*0.15, HEIGHT*0.15, "Play again!");
  
  socket.on("notAvailable", (x) => notAvailable());
  
  /// Client events
  socket.on("heartbeat", data => heartbeat(data));
  socket.on("updatePlayers", data => updatePlayers(data.players));
  socket.on("updateBoard", data => updateBoard(data));
  socket.on("updateScores", scores => updateScores(scores));
  socket.on("color", color => setColor(color));
  socket.on("boardSize", size => setBoardSize(size));
  socket.on("showMessage", message => alert(message));
  socket.on("disconnect", playerId => removePlayer(playerId));
}

function draw() {
  background(120,120,120);
  image(assets.get("wood"), 0,0, WIDTH, HEIGHT);
  
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
  let top = assets.get("art-top");
  image(top, 0, 0, WIDTH, WIDTH/top.width*top.height);
  
  let title = assets.get("title")
  let titleScaling = 1.05;
  let titleW = HEIGHT*0.4/title.height*title.width*titleScaling
  image(title, WIDTH/2-titleW/2, HEIGHT*0.23, titleW, HEIGHT*0.4*titleScaling);
  
  let bot = assets.get("art-bottom");
  let botScaling = 0.7;
  let botH = WIDTH/bot.width*bot.height*botScaling
  image(bot, 0, HEIGHT-botH, WIDTH*botScaling, botH);
  
  let papers = assets.get("papers");
  image(papers, WIDTH*0.75, HEIGHT*0.6, WIDTH*0.3, HEIGHT*0.4);
  
  push();
  textSize(HEIGHT*0.029);
  translate(WIDTH*0.798, HEIGHT*0.65, WIDTH*0.19, HEIGHT*0.4);
  rotate(0.074);
  text("\nThe artist has\ngone away!\nA couple of splats\ntake the chance to play\nCollect powerups and\nmess with the canvas!", 0, 0, WIDTH*0.18, HEIGHT*0.4);
  pop();
  "The artist has gone away!"
  "A couple of splats take the chance to play!"
  "Collect powerups and mess with the canvas"
  readyButton.draw();
}

function showGame() {
  
  drawBoard(board);
  
  for (let i = 0; i < players.length; i++) {
    players[i].draw(board);
  }
  
  image(assets.get("frame"), board.x-board.width*0.136, board.y-board.height*0.12, board.width*1.262, board.height*1.25);
  
  drawTimer();
}

function showResults() {
  if(resultsBoard != undefined) {
    drawBoard(resultsBoard);
  
    image(assets.get("frame"), board.x-board.width*0.136, board.y-board.height*0.12, board.width*1.262, board.height*1.25);
    
    drawTimer();
  }
  
  drawResultsTable();
}

function drawTimer() {
  push();
  textSize(HEIGHT/20);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  fill(0);
  strokeWeight(4);
  text(Math.ceil(timer/60), board.x, HEIGHT*0.012, board.width, HEIGHT*0.1);
  pop();
}

function drawFPS() {
  push();
  textSize(HEIGHT/20);
  textAlign(CENTER, CENTER);
  fill(50);
  strokeWeight(4);
  text(int(frameRate()), WIDTH*0.8, 0, WIDTH*0.2, HEIGHT*0.1);
  pop();
}

function drawBoard(board) {
  image(assets.get("canvas"), board.x, board.y, board.width, board.height);
  
  if(board != null && colormap != null && colormap.size > 0)
    board.draw(colormap);
}

function drawResultsTable() {
  push();
  
  // Table
  fill(250, 250, 250, 180);
  strokeWeight(WIDTH*0.005);
  rect(WIDTH*0.325, HEIGHT*0.1, WIDTH*0.35, HEIGHT*0.8);
  textSize(HEIGHT/40);
  textAlign(CENTER);
  
  // Frame
  let frame = assets.get("resultsFrame");
  image(frame, WIDTH*0.25, 0, WIDTH*0.5, HEIGHT*0.95);
  
  // Title
  // text("And the winner is...", WIDTH*0.35, HEIGHT*0.3, WIDTH*0.3, HEIGHT*0.1);
  
  var sorted = Array.from(results).sort((a, b) => b[1] - a[1]);
  // Winner
  textSize(HEIGHT/20);
  fill(238, 116, 187);
  strokeWeight(4);
  var winner = getPlayer(sorted[0][0]);
  text(winner.name+": "+Math.round(sorted[0][1]*100)+"%",
                  WIDTH*0.35, HEIGHT*0.4, WIDTH*0.3, HEIGHT*0.1);
  image(winner.image, WIDTH*0.39, HEIGHT*0.39, WIDTH*0.038, HEIGHT*0.06);
  
  // Other(s)
  textSize(HEIGHT/40);
  textAlign(CENTER);
  for(var i=1; i < sorted.length; i++) {
    if(sorted[i][1] != undefined && getPlayer(sorted[i][0]) != undefined) {
      let player = getPlayer(sorted[i][0]);
      image(player.image, WIDTH*0.43, HEIGHT*0.48, WIDTH*0.03, HEIGHT*0.05);
      text(player.name+": "+Math.round(sorted[i][1]*100)+"%",
            0, HEIGHT*0.45+i*HEIGHT*0.05, WIDTH, HEIGHT*0.1);
    }
  }
  pop();
  
  finishButton.draw();
}

////////////////////////////////////////////////////////////////// LOGIC UPDATES

function heartbeat(data) {
  setState(data.state);
  
  timer = data.timer;
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
    
    let direction = {x:((mouseX-board.x)/board.width-player.x),
                     y:((mouseY-board.y)/board.height-player.y)};
    
    var move = {direction: direction};
    
    // This updates the player position before it comes back from the server, sort of a prediction
    player.move(direction);
    
    socket.emit('move', {x:(mouseX-board.x)/board.width, y:((mouseY-board.y)/board.height)});
    
    // This shows claimed spots for the player before they come back from the server
    board.claim(player.x, player.y, player.radius, player.id);
  }
}

////////////////////////////////////////////////////////////////// PLAYERS LOGIC

function updatePlayers(serverPlayers) {
  for (let i = 0; i < serverPlayers.length; i++) {
    let playerFromServer = serverPlayers[i];
    if (!playerExists(playerFromServer)) {
      players.push(new Player(playerFromServer, splats));
    }
    else {
      let localPlayer = players[i]
      localPlayer.update(playerFromServer, splats);
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
  let height = HEIGHT*0.8;
  board = new Board(size, WIDTH/2-height/2, HEIGHT/2-height/2, height, height);
}

function updateBoard(data) {
  board.update(data.board);
  colormap = new Map(JSON.parse(data.colormap));
  
  powerUps = JSON.parse(data.powerUps);
  
  board.updatePowerUps(powerUps);
}

function updateScores(scores) {
  results = new Map(JSON.parse(scores));
  resultsBoard = new Board(board.size, board.x, board.y, board.width, board.height);
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
  fill(230,230,230, 200);
  stroke(230,230,230, 150);
  //rect(this.x,this.y,this.width,this.height);
  image(assets.get("button"), this.x-this.width*0.05,this.y-this.height*0.05,this.width*1.1,this.height*1.2);
  textSize(this.height*0.28);
  textAlign(CENTER, CENTER);
  fill(255);
  stroke(120, 120, 120, 60);
  strokeWeight(6);
  textStyle(BOLD);
  text(this.text, this.x+this.width*0.02, this.y-this.height*0.025, this.width, this.height);
  stroke(230,230,230, 40);
  pop();
}

Button.prototype.isMouseInside = function() {
  return mouseX > this.x &&
         mouseX < (this.x + this.width) &&
         mouseY > this.y &&
         mouseY < (this.y + this.height);
};