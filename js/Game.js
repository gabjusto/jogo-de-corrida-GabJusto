class Game {
  constructor() {
    this.resetTitle = createElement("h2")
    this.resetButton = createButton("")
    this.leadeboardTitle = createElement("h2");

    this.leader1 = createElement("h2");
    this.leader2 = createElement("h2");

    this.playerMoving = false
    this.leftKeyActive = false
    this.blast = false
    this.collided = false
    this.velocityY = 10

    
  }
  
  getState() {
    var gameStateRef = database.ref("gameState");
    gameStateRef.on("value", function(data) {
      gameState = data.val();
    });
  }
  
  updateState(state) {
    database.ref("/").update({gameState:state})
  }
 
  start() {
    player = new Player();
    playerCount = player.getCount();

    form = new Form();
    form.display();
    
    car1 = createSprite(width / 2 - 50, height - 100);
    car1.addImage("car1", car1_img);
    car1.scale = 0.07;
    car1.addImage("blast",blast)

    car2 = createSprite(width / 2 + 100, height - 100);
    car2.addImage("car2", car2_img);
    car2.scale = 0.07;
    car2.addImage("blast",blast)
    cars = [car1, car2];

    coins = new Group()
    fuels = new Group()
    obstacles = new Group()
    var obstaclesPositions = [
      { x: width / 2 + 250, y: height - 800, image: obs1 },
      { x: width / 2 - 150, y: height - 1300, image: obs1 },
      { x: width / 2 + 250, y: height - 1800, image: obs1 },
      { x: width / 2 - 180, y: height - 2300, image: obs2 },
      { x: width / 2, y: height - 2800, image: obs2 },
      { x: width / 2 - 180, y: height - 3300, image: obs1 },
      { x: width / 2 + 180, y: height - 3300, image: obs2 },
      { x: width / 2 + 250, y: height - 3800, image: obs2 },
      { x: width / 2 - 150, y: height - 4300, image: obs1 },
      { x: width / 2 + 250, y: height - 4800, image: obs2 },
      { x: width / 2, y: height - 5300, image: obs1 },
      { x: width / 2 - 180, y: height - 5500, image: obs2 }
    ];
    this.addSprite(coins,18,coinImg,0.09)
    this.addSprite(fuels,4,fuelImg,0.02)
    this.addSprite(obstacles,obstaclesPositions.length,obs1,0.04,obstaclesPositions)
  }

  addSprite(spriteGroup,numberOfSprites,spriteImage,spriteScale,position = []){
    for (let i = 0; i < numberOfSprites; i++) {
      var x,y
      if (position.length > 0) {
        x = position [i].x
        y = position[i].y
        spriteImage = position[i].image
      } else {
        x=random(width/2 + 150,width/2 - 150)
        y=random(-height * 4.5,height - 400)
      }
     
      var sprite = createSprite(x,y)
      sprite.addImage(spriteImage)
      sprite.scale = spriteScale
      spriteGroup.add(sprite)
      
    }
  }

  handleElements() {
    form.hide();
    form.titleImg.position(40, 50);
    form.titleImg.class("gameTitleAfterEffect");

    this.resetTitle.html("resetar jogo")
    this.resetTitle.position(width/2 + 200, 40)
    this.resetTitle.class("resetText")
    
    this.resetButton.position(width/2 + 230, 100)
    this.resetButton.class("resetButton")

    this.leadeboardTitle.html("Leaderboard");
    this.leadeboardTitle.class("resetText");
    this.leadeboardTitle.position(width / 3 - 60, 40);

    this.leader1.class("leadersText");
    this.leader1.position(width / 3 - 50, 80);

    this.leader2.class("leadersText");
    this.leader2.position(width / 3 - 50, 130);
  }
  
  handleResetButton(){
    this.resetButton.mousePressed( () => {
      database.ref("/").set({
        gameState:0,
        playerCount:0,
        players:{},
        carsAtEnd:0,
      })
      window.location.reload()
    })

  }

  play() {
    this.handleElements();
    this.handleResetButton();
    Player.getPlayersInfo();
    player.getCarsAtEnd();
    
    if (allPlayers !== undefined) {
      image(track, 0, -height * 5, width, height * 6);
      this.showLeaderboard()
      this.showFuelBar()
      this.showLife()
      var index = 0
      for (var plr in allPlayers) {
       index += 1
       var x = allPlayers[plr].positionX
       var y = height - allPlayers[plr].positionY
       var currentLife = allPlayers[plr].life
       if (currentLife<=0) {
          cars[index-1].changeImage("blast")
          cars[index-1].scale = 0.3
       }
       cars[index - 1].position.x = x
       cars[index - 1].position.y = y
       if (index === player.index) {
        fill("red")
        ellipse(x,y,60,60)
        camera.position.y = cars[index - 1].position.y
        this.handleFuel(index)
        this.handlePowerCoins(index)
        this.handleObstacleCollision(index)
        this.handleCarACollisionWithCarB(index)
        if (player.life<=0) {
          this.blast = true
          this.playerMoving = false
        }
       }
      }
      this.handlePlayerControls()
      const finishLine = height * 6 - 100
      if (player.positionY>finishLine) {
        gameState = 2
        player.rank +=1
        Player.updateCarsAtEnd(player.rank)
        player.update()
        this.showRank()
      }
      if (this.playerMoving) {
        player.positionY += this.velocityY/2
        player.update ()
      }

      if (this.collided) {
        this.velocityY = 1
        setTimeout(() => {
          this.collided = false
          this.velocityY = 10
        }, 2000);
      }
      
      drawSprites();
    }
  }
  handlePlayerControls(){
    if (!this.blast) {
      
    if (keyIsDown(UP_ARROW)) {
      player.positionY += this.velocityY
      player.update()
      this.playerMoving = true
    }
    if (keyIsDown(LEFT_ARROW) && player.positionX > width / 3 - 50) {
      player.positionX -= 5;
      player.update();
      this.leftKeyActive = true
    }

    if (keyIsDown(RIGHT_ARROW) && player.positionX < width / 2 + 300) {
      player.positionX += 5;
      player.update();
      this.leftKeyActive = false
    }
   }
  }

  showLeaderboard() {
    var leader1, leader2;
    var players = Object.values(allPlayers);
    if (
      (players[0].rank === 0 && players[1].rank === 0) ||
      players[0].rank === 1
    ) {
      // &emsp;    Essa etiqueta é usada para exibir quatro espaços.
      leader1 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;

      leader2 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;
    }

    if (players[1].rank === 1) {
      leader1 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;

      leader2 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;
    }

    this.leader1.html(leader1);
    this.leader2.html(leader2);
  }
 
  handleFuel(index) {
    //adicionando combustível
    cars[index - 1].overlap(fuels, function(collector, collected) {
      player.fuel = 185;
      
        
      
      //o sprite é coletado no grupo de colecionáveis que desencadeou
      //o evento
      collected.remove();
    });
    if (player.fuel>0) {
      player.fuel -= 0.3
      
    }
    if (player.fuel<=0) {
      gameState = 2
      this.gameOver()
    }
  }

  handlePowerCoins(index) {
    cars[index - 1].overlap(coins, function(collector, collected) {
      player.score += 21;
      player.update();
      //o sprite é coletado no grupo de colecionáveis que desencadeou
      //o evento
      collected.remove();
    });
  }

  handleObstacleCollision(index) {
    if (cars[index - 1].collide(obstacles)) {
      if (this.leftKeyActive) {
        player.positionX += 100;
      } else {
        player.positionX -= 100;
      }
        this.collided = true
        
      //Reduzindo a vida do jogador
      if (player.life > 0) {
        player.life -= 185 / 4;
      }

      player.update();
    }
  }

  handleCarACollisionWithCarB(index) {
    if (index === 1) {
      if (cars[index - 1].collide(cars[1])) {
        if (this.leftKeyActive) {
          player.positionX += 100;
        } else {
          player.positionX -= 100;
        }

        //Reduzindo a vida do jogador
        if (player.life > 0) {
          player.life -= 185 / 4;
        }

        player.update();
      }
    }
    if (index === 2) {
      if (cars[index - 1].collide(cars[0])) {
        if (this.leftKeyActive) {
          player.positionX += 100;
        } else {
          player.positionX -= 100;
        }

        //Reduzindo a vida do jogador
        if (player.life > 0) {
          player.life -= 185 / 4;
        }

        player.update();
      }
    }
  }
  
  showRank() {
    swal({
      title: `Incrível!${"\n"}${player.rank}º lugar`,
      text: "Você alcançou a linha de chegada com sucesso!",
      imageUrl:
        "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
      imageSize: "100x100",
      confirmButtonText: "Ok"
    });
  }
  gameOver() {
    swal({
      title: `Fim de Jogo`,
      text: "Oops você perdeu a corrida!",
      imageUrl:
        "https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
      imageSize: "100x100",
      confirmButtonText: "Obrigado por jogar"
    });
  }
  showFuelBar() {
    push();
    image(fuelImg, width / 2 - 130, height - player.positionY - 230, 20, 20);
    fill("white");
    rect(width / 2 - 100, height - player.positionY - 230, 185, 20);
    fill("#ffc400");
    rect(width / 2 - 100, height - player.positionY - 230, player.fuel, 20);
    noStroke();
    pop();
  }
  showLife() {
    push();
    image(lifeImage, width / 2 - 130, height - player.positionY - 280, 20, 20);
    fill("white");
    rect(width / 2 - 100, height - player.positionY - 280, 185, 20);
    fill("#f50057");
    rect(width / 2 - 100, height - player.positionY - 280, player.life, 20);
    noStroke();
    pop();
  }
}
