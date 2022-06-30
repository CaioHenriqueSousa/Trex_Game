var trex, trex_running,trex_collided, edges, trexDie, checkpoint, jump
var groundImage;
var ground;
var invisibleGround
var cloud, cloudImage
var obstacles, obstacles1, obstacles2, obstacles3, obstacles4, obstacles5, obstacles6
var score = 0
var obstaclesGroup
var cloudsGroup
var PLAY = 1
var END = 0
var stateGame = PLAY
var restart, restartImg
var gameOver, gameOverImg
function preload() {
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_collided = loadAnimation("trex_collided.png")
  groundImage = loadImage("ground2.png")
  cloudImage = loadImage("cloud.png")
  obstacles1 = loadImage("obstacle1.png")
  obstacles2 = loadImage("obstacle2.png")
  obstacles3 = loadImage("obstacle3.png")
  obstacles4 = loadImage("obstacle4.png")
  obstacles5 = loadImage("obstacle5.png")
  obstacles6 = loadImage("obstacle6.png")
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  trexDie = loadSound("die.mp3")
  checkpoint = loadSound("checkpoint.mp3")
  jump = loadSound("jump.mp3")
}

function setup() {
  createCanvas(600, 200);

  //criando o trex
  trex = createSprite(50, 160, 20, 50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided)
  edges = createEdgeSprites();
  ground = createSprite(100, 180, 600, 20)
  ground.addImage(groundImage)
  invisibleGround = createSprite(100, 195, 600, 20)
  invisibleGround.visible = false
  //adicione dimensão e posição ao trex
  trex.scale = 0.5;
  trex.x = 50

  obstaclesGroup = new Group()
  cloudsGroup = new Group()
  
  restart = createSprite(300, 100)
  restart.addImage(restartImg)
  restart.scale = 0.65
  gameOver = createSprite(300,50)
  gameOver.addImage(gameOverImg)
  gameOver.scale = 0.45
}


function draw() {
  //definir a cor do plano de fundo 
  background("white");
  textSize(24)
  text("Score: " + score, 400, 60)


  //impedir que o trex caia
  trex.collide(invisibleGround)

  if (stateGame == PLAY) {
    restart.visible = false
    gameOver.visible = false
    score = score + Math.round(frameCount / 60)
    ground.velocityX = -2;
    if (ground.x < 0) {
      ground.x = ground.width / 2
    }
    trex.velocityY = trex.velocityY + 0.5;
    //pular quando tecla de espaço for pressionada
    if (keyDown("space") && trex.y >= 150) {
      jump.play()
      trex.velocityY = -10;
    }
    if(score%100 == 0 && score > 0){
      checkpoint.play()
    }
    spawnClouds()
    spawnObstacles()
    if(obstaclesGroup.isTouching(trex)){
      trexDie.play()
      stateGame = END
    }
  }

  else if (stateGame == END) {
    restart.visible = true
    gameOver.visible = true
    ground.velocityX = 0;
    trex.velocityY = 0;
    trex.changeAnimation("collided", trex_collided)
    obstaclesGroup.setLifetimeEach(-1)
    cloudsGroup.setLifetimeEach(-1)
    obstaclesGroup.setVelocityXEach(0)
    cloudsGroup.setVelocityXEach(0)
    if(mousePressedOver(restart)){
      reset()
    }
  }

  drawSprites();
}
function reset(){
  stateGame = PLAY
  cloudsGroup.destroyEach()
  obstaclesGroup.destroyEach()
  trex.changeAnimation("running", trex_running)
  score = 0
}
function spawnClouds() {
  if (frameCount % 60 == 0) {
    cloud = createSprite(600, 50, 20, 20)
    cloud.velocityX = -3
    cloud.addImage(cloudImage)
    cloud.y = Math.round(random(10, 60))
    cloud.scale = 0.5
    cloud.depth = trex.depth
    trex.depth = trex.depth + 1
    cloud.lifetime = 200
    cloudsGroup.add(cloud)
  }
}

function spawnObstacles() {
  if (frameCount % 60 == 0) {
    obstacles = createSprite(600, 160, 20, 20)
    obstacles.velocityX = -6
    var sorteio = Math.round(random(1, 6))
    switch (sorteio) {
      case 1: obstacles.addImage(obstacles1)
        break
      case 2: obstacles.addImage(obstacles2)
        break
      case 3: obstacles.addImage(obstacles3)
        break
      case 4: obstacles.addImage(obstacles4)
        break
      case 5: obstacles.addImage(obstacles5)
        break
      case 6: obstacles.addImage(obstacles6)
        break
      default: break
    }
    obstacles.lifetime = 100
    obstacles.scale = 0.7
    obstaclesGroup.add(obstacles)
  }
}