class Form {
  constructor() {
    this.input = createInput("").attribute("placeholder", "Digite seu nome");
    this.playButton = createButton("Jogar");
    //this.titleImg = createImg("./assets/TITULO.png", "nome do jogo");
    this.greeting = createElement("h2");
  }

  setElementsPosition(){
    //this.titleImg.position(120,0)
    this.input.position(width/2-100,height/2-80)
    this.playButton.position(width/2-90,height/2-20)
    this.greeting.position(width/2-300,height/2-100)
  }

  setElementsStyle(){
    this.input.class('customInput')
    this.playButton.class('customButton')
    //this.titleImg.class('gameTitle')
    this.greeting.class('greeting')
  }

  handleMousePressed(){
    this.playButton.mousePressed( () => {
      this.input.hide()
      this.playButton.hide()
      var mensage = `olá, ${this.input.value()}<br>
      aguarde por mais jogadores`
      this.greeting.html(mensage)
      playerCount += 1;
      player.name = this.input.value();
      player.index = playerCount;
      gameState = 1
    })
  }

  hide() {
    this.greeting.hide();
    this.playButton.hide();
    this.input.hide();
  }

  display(){
    this.setElementsPosition()
    this.setElementsStyle()
    this.handleMousePressed()
  }

}
