var canvas;
var backgroundImage, bgImg, car1_img, car2_img, track;
var database, gameState;
var form, player, playerCount, game;
var allPlayers, car1, car2;
var cars = [];
var coins
var fuels
var fuelImg
var coinImg
var obstacles
var obs1
var obs2
var lifeImage
var blast

function preload() {
  backgroundImage = loadImage("./assets/planodefundo.png");
  car1_img = loadImage("./assets/car1.png");
  car2_img = loadImage("./assets/car2.png");
  track = loadImage("./assets/track.jpg");
  fuelImg = loadImage("./assets/fuel.png");
  coinImg = loadImage("./assets/goldCoin.png");
  obs1 = loadImage("./assets/obstacle1.png");
  obs2 = loadImage("./assets/obstacle2.png")
  lifeImage = loadImage("./assets/life.png")
  blast = loadImage("./assets/blast.png")
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  database = firebase.database();
  game = new Game();
  game.getState();
  game.start();

}

function draw() {
  background(backgroundImage);
  if (playerCount==2) {
    game.updateState(1)
  }
  if (gameState==1) {
    game.play();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
