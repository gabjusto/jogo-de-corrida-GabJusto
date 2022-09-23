class Game {
  constructor() {
    
    this.statsTitle = createElement("h2");

    this.leader1 = createElement("h2");
    

    
    
  }
  
  getState() {
    
  }
  
  updateState() {
   
  }
 
  start() {
    
    player = new Player();
    

    form = new Form();
    form.display();
    cavaleiro = createSprite(width/2,height/2)
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
    //form.titleImg.position(40, 50);
    //form.titleImg.class("gameTitleAfterEffect");

    this.statsTitle.html("status");
    this.statsTitle.class("resetText");
    this.statsTitle.position(50, 30);

    this.leader1.class("leadersText");
    this.leader1.position(width / 3 - 50, 80);

  }

  play() {
    this.handleElements();
    if (player!=undefined) {
      var x = player.positionX
      var y = player.positionY
      cavaleiro.position.x = x
      cavaleiro.position.y = y
      
     
      //camera.position.y = player.positionY
      player.positionX = camera.position.x
     
    }
    this.handlePlayerControls();  
   
    drawSprites();
    
  }
  handlePlayerControls(){
      
    if (keyIsDown(UP_ARROW)) {
      player.positionY -= 5
      //player.update()
      this.playerMoving = true
    }
    if (keyIsDown(LEFT_ARROW)) {
      camera.position.x -=5
      //player.positionX -= 5;
      //player.update();
      this.leftKeyActive = true
    }

    if (keyIsDown(RIGHT_ARROW)) {
      camera.position.x += 5
      //player.positionX += 5;
      //player.update();
      this.leftKeyActive = false
    }

    if (keyIsDown(DOWN_ARROW)) {
      player.positionY += 5
      //player.update()
      this.playerMoving = true
    }
   
  }

  showLeaderboard() {
    var leader1
    
    this.leader1.html(leader1);
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
