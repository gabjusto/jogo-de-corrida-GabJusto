var canvas;
var backgroundImage;
var gameState = 0
var form, player, playerCount, game;
var lifeImage;
var cavaleiro 


function preload() {
 
  lifeImage = loadImage("./assets/life.png")
 
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  game = new Game();
  //game.getState();
  game.start();

}

function draw() {
  background("green");
  if (gameState === 1) {
    game.play()
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
