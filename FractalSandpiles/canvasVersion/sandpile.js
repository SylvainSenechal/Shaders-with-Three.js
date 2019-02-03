window.addEventListener('load', init);
window.addEventListener('resize', resize, false);

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////

// Faire un bouton render ou non (gain de temps), booléan sur dessiné
// Faire un bouton pour choisir le nombre de grains de départ

function resize(){
	height = window.innerHeight;
	width = window.innerWidth;
  ctx.canvas.width = window.innerWidth
  ctx.canvas.height = window.innerHeight
}
function init(){
  canvas = document.getElementById('mon_canvas')
  ctx = canvas.getContext('2d')

  ctx.canvas.width = width
  ctx.canvas.height = height
	ctx.font = "40px Comic Sans MS"
  initLastSandPile()
  initCurrentGrid()
  loop()
}
function loop(){ // Voir l'ordre des fonctions

  if(!SandPile.finished){
    for(x=0; x<SandPile.speed; x++){
      collapse()
    }
    if(SandPile.render){
      dessin()
    }
    dessinInfo()
  }
  else{
    return
  }

  requestAnimationFrame(loop);
}

var ctx, canvas
var width = window.innerWidth
var height = window.innerHeight

var SandPile = {
  sizeX: 10, // %2 == 0
  sizeY: 10, // %2 == 0

  maxSize: 0,//SandPile.sizeX/2,

  offsetX: Math.floor(width/2),
  offsetY: Math.floor(height/2),

  lastGrid: [],
  currentGrid: [],
  nbGrain: 10000,
  speed: 1,
  drawSize: 1,

  finished: false,
  render: true,
}

function initLastSandPile(){
  for(i=0; i<SandPile.sizeX; i++){
    SandPile.lastGrid[i] = []
    for(j=0; j<SandPile.sizeY; j++){
      SandPile.lastGrid[i][j] = 0
    }
  }
  SandPile.lastGrid[SandPile.sizeX/2][SandPile.sizeY/2] = SandPile.nbGrain
}

function initCurrentGrid(){
  for(i=0; i<SandPile.sizeX; i++){
    SandPile.currentGrid[i] = []
    for(j=0; j<SandPile.sizeY; j++){
      SandPile.currentGrid[i][j] = 0
    }
  }
  SandPile.currentGrid[SandPile.sizeX/2][SandPile.sizeY/2] = SandPile.nbGrain
}

function collapse(){
  let finished = true
  let changeSize = false
  for(i=0; i<SandPile.sizeX; i++){
    for(j=0; j<SandPile.sizeY; j++){
      if(SandPile.lastGrid[i][j] < 4){
        SandPile.currentGrid[i][j] = SandPile.lastGrid[i][j]
      }
      else{
        finished = false
        SandPile.currentGrid[i][j] = SandPile.lastGrid[i][j] - 4
        SandPile.currentGrid[i+1][j]++
        SandPile.currentGrid[i-1][j]++
        SandPile.currentGrid[i][j+1]++
        SandPile.currentGrid[i][j-1]++
        if(i+1 > SandPile.maxSize+1){
          SandPile.maxSize = i+1
          changeSize = true

        }
      }
    }
  }
  if(changeSize == true){
    SandPile.sizeX += 2
    SandPile.sizeY += 2
    SandPile.offsetX--
    SandPile.offsetY--
    redefineGrids()
  }
  SandPile.finished = finished
  SandPile.lastGrid = SandPile.currentGrid
}

function redefineGrids(){
  let grid = []
  for(a=0; a<SandPile.sizeX; a++){
    grid[a] = []
    for(b=0; b<SandPile.sizeY; b++){
      grid[a][b] = 0
    }
  }
  for(a=0; a<SandPile.sizeX-2; a++){
    for(b=0; b<SandPile.sizeY-2; b++){
      grid[a+1][b+1] = SandPile.currentGrid[a][b]
    }
  }

  SandPile.currentGrid = grid
}

function dessin(){
  ctx.clearRect(0, 0, width, height)

  for(i=0; i<SandPile.sizeX; i++){
    for(j=0; j<SandPile.sizeY; j++){
      if(SandPile.currentGrid[i][j] == 0){
        ctx.fillStyle = "rgb(0, 0, 0)"
      }
      else if(SandPile.currentGrid[i][j] == 1){
        ctx.fillStyle = "rgb(255, 255, 0)"
      }
      else if(SandPile.currentGrid[i][j] == 2){
        ctx.fillStyle = "rgb(0, 0, 255)"
      }
      else if(SandPile.currentGrid[i][j] == 3){
        ctx.fillStyle = "rgb(255, 0, 0)"
      }
      ctx.fillRect((i*SandPile.drawSize)+SandPile.offsetX, (j*SandPile.drawSize)+SandPile.offsetY, SandPile.drawSize, SandPile.drawSize);
    }
  }


}

function dessinInfo(){
  ctx.clearRect(0, 0, width, 100)
  ctx.strokeStyle = "#000000"
	ctx.strokeText("Grains of sand left in the middle : " + SandPile.currentGrid[SandPile.sizeX/2][SandPile.sizeY/2] + "/" + SandPile.nbGrain, 220, 40)
}

/////////////////////
// ACTION DES BOUTONS
/////////////////////

function render(){
  SandPile.render = !SandPile.render

  if(SandPile.render){
    document.getElementById("hide").innerHTML = "Hide Render (faster)"
  }
  else{
    document.getElementById("hide").innerHTML = "Show Render (slower)"
  }
}

var slider = document.getElementById("slider");
slider.oninput = function() {
  SandPile.speed = this.value
  document.getElementById("slideVal").innerHTML = "Speed(1-500) : " + this.value
}

var draw = document.getElementById("draw");
draw.oninput = function() {
  if(this.value == 1){
    SandPile.offsetX += 150
    SandPile.offsetY += 140
  }
  else if(this.value == 2 && SandPile.drawSize == 3){
    SandPile.offsetX += 150
    SandPile.offsetY += 140
  }
  else if(this.value == 2 && SandPile.drawSize == 1){
    SandPile.offsetX -= 150
    SandPile.offsetY -= 140
  }
  else if(this.value == 3){
    SandPile.offsetX -= 150
    SandPile.offsetY -= 140
  }

  SandPile.drawSize = this.value
  document.getElementById("drawP").innerHTML = "Draw Size(1-3) : " + this.value
}

function start(){
  SandPile.nbGrain = document.getElementById("nbGrain").value
  SandPile.sizeX = 10
  SandPile.sizeY = 10
  SandPile.offsetX = Math.floor(width/2)
  SandPile.offsetY = Math.floor(height/2)
  SandPile.maxSize = 0
  SandPile.finished = false
  SandPile.render = true
  SandPile.lastGrid = []
  SandPile.currentGrid = []
  initLastSandPile()
  initCurrentGrid()
  loop()
}


document.onwheel = function(e){ // !! pas trop dezoomer pour pas sortir du cadre
  if(e.deltaY<0){ // zoom
		ctx.scale(1.1, 1.1)
	}
	else{ // dezoom
    ctx.scale(0.9, 0.9)
	}
}
