<h1 align="center">
  <img height="400" alt="Artist's gone" src="https://github.com/fernandossmm/artists-gone/blob/main/public/assets/title.png" />
  <br>
    Artist's gone
  <br>
</h1>

### Winner of the EII Techfest Game jam 2024

![node.js](https://img.shields.io/badge/node.js-6DA55F?style=flat&logo=node.js&logoColor=white) ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=flat&logo=javascript&logoColor=%23F7DF1E) ![p5js](https://img.shields.io/badge/p5.js-ED225D?style=flat&logo=p5.js&logoColor=FFFFFF)

<div align="center">
	<img height="300" alt="screenshot" src="https://github.com/user-attachments/assets/048a82c7-1382-412c-92f9-6d82a5cc1262" />
	<p>The artist has gone away! A couple of paint splats take the chance to play. Collect powerups and mess with the canvas!</p>
</div>

## Features
- 2 player vs game, developed using Node.js and p5.js
- [Currently hosted here](https://pluto-core-3.resiz.es/) (you need two players!)
- Lag-resistant architecture, with client-side movement prediction of both local player and opponent.
- Paint the canvas by sliding over it. The one that controls most of the canvas when the time ends is the winner!
- Built in two days for a game jam, pardon the possible jank.

## How to play
- To start a game, push the "Ready?" button. It will chage to "Ready!", which means it's waiting for an opponent.
- To control your splat, move the mouse around the canvas. Your splat will follow it and paint as they move.
- Collect powerups to paint more of the canvas! Available powerups are:
	- **Paint bucket**: When you collect it, it paints a circle around you.
	- **Wings**: Makes you go faster through the canvas. It can stack, so you can go blazing fast!
	- **Paint roller**: Makes you bigger, so you can cover more area. It can stack too, become huge!

## How to install and run
- Make sure to have [Node.js](https://nodejs.org/) installed and updated
- Clone the repository
- Run ```npm install``` and ```npm start```
- Navigate to [http://localhost:3000](http://localhost:3000)

## Architecture overview
### The server
The main server application, ```server.js```, uses express to serve the client a static webpage on connect. This client will make a websocket connection and send regular requests, which the server manages using socket.io.

The server also holds a Board and the two Player objects. Each of those, as well as the Powerups, are defined independently in their own files.

### The client
The client is written using a bit of HTML but mostly in [p5.js](https://p5js.org/). It is a powerful and easy-to-use graphics library for data, art and simple games. The main file in the client is called ```sketch.js```, and it handles the connections with the server as well as some of the game logic.

The client also has separate server for the Board, Player and Powerup classes. This is necessary, as to deal with lag both splats' movements are predicted by the client and updated regularly by the server.

## Contributions
This project is not actively maintained, but feel free to ask for help or contribute!

## License
Copyright Fernando SSMM (programming) and Brezo Díaz (art), 2025. All rights reserved.








