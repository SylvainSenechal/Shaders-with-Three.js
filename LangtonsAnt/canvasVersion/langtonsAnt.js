var ctx, canvas
var width = window.innerWidth
var height = window.innerHeight

const resize = () => {
	height = window.innerHeight;
	width = window.innerWidth;
  ctx.canvas.width = window.innerWidth
  ctx.canvas.height = window.innerHeight
}
const init = () => {
  canvas = document.getElementById('mon_canvas')
  ctx = canvas.getContext('2d')

  ctx.canvas.width = width
  ctx.canvas.height = height
	ctx.font = "40px Comic Sans MS"

  loop()
}

const loop = () => {
	for(i=0; i<10; i++){
		//makeDir()
		move()
	}
	draw()

  requestAnimationFrame(loop);
}

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
const gridSizeX = width
const gridSizeY = height

const Ant = {
	x: Math.floor(Math.random()*(width*0.8) + width*0.1), //Math.floor(width/2),
	y: Math.floor(Math.random()*(height*0.8) + height*0.1), //Math.floor(height/2),
	dir: 'gauche'
}

const Grid = {
	// 1: {
	// 	pos: 20,
	// 	couleur: 0
	// },
	// 2: {
	// 	pos: 30,
	// 	couleur: 0
	// },
	// 3: {
	// 	pos: 6000,
	// 	couleur: 0
	// }
}

// noir : gauche, change en blanc
// blanc: droit, change en noir

const HAUT = 0
const BAS = 2
const GAUCHE = 3
const DROITE = 1

// const makeDir = () => {
// 	if(Grid[Ant.x + Ant.y*width] === undefined){ //|| Grid[Ant.x + Ant.y*width] === 1){
// 		Grid[Ant.x + Ant.y*width] = {}
// 		Grid[Ant.x + Ant.y*width].pos = Ant.x + Ant.y*width
// 		Grid[Ant.x + Ant.y*width].couleur = 0
// 		Ant.dir++
//
// 		if(Ant.dir > GAUCHE) Ant.dir = HAUT
// 	}
// 	else if(Grid[Ant.x + Ant.y*width].couleur === 1){
// 		Grid[Ant.x + Ant.y*width].pos = Ant.x + Ant.y*width
// 		Grid[Ant.x + Ant.y*width].couleur = 0
//
// 		Ant.dir++
// 		if(Ant.dir > GAUCHE) Ant.dir = HAUT
// 	}
// 	else{
// 		Grid[Ant.x + Ant.y*width].pos = Ant.x + Ant.y*width
// 		Grid[Ant.x + Ant.y*width].couleur = 1
// 		Ant.dir--
// 		if(Ant.dir < HAUT) Ant.dir = GAUCHE
// 	}
// }
//
// const move = () => {
// 	if(Ant.dir === HAUT) Ant.y--
// 	else if (Ant.dir === BAS) Ant.y++
// 	else if (Ant.dir === GAUCHE) Ant.x--
// 	else Ant.x++
// }

const move = () => {
	if(Ant.dir === 'haut') {
		if(Grid[Ant.x + Ant.y*width] === undefined || Grid[Ant.x + Ant.y*width].couleur === 1){
			Grid[Ant.x + Ant.y*width] = {}
			Grid[Ant.x + Ant.y*width].pos = Ant.x + Ant.y*width
			Grid[Ant.x + Ant.y*width].couleur = 0
			Ant.x++
			Ant.dir = 'droite'
		}
		else{
			Grid[Ant.x + Ant.y*width].pos = Ant.x + Ant.y*width
			Grid[Ant.x + Ant.y*width].couleur = 1
			Ant.x--
			Ant.dir = 'gauche'
		}
	}

	else if (Ant.dir === 'bas') {
		if(Grid[Ant.x + Ant.y*width] === undefined || Grid[Ant.x + Ant.y*width].couleur === 1){
			Grid[Ant.x + Ant.y*width] = {}
			Grid[Ant.x + Ant.y*width].pos = Ant.x + Ant.y*width
			Grid[Ant.x + Ant.y*width].couleur = 0
			Ant.x--
			Ant.dir = 'gauche'
		}
		else{
			Grid[Ant.x + Ant.y*width].pos = Ant.x + Ant.y*width
			Grid[Ant.x + Ant.y*width].couleur = 1
			Ant.x++
			Ant.dir = 'droite'
		}
	}
	else if (Ant.dir === 'gauche') {
		if(Grid[Ant.x + Ant.y*width] === undefined || Grid[Ant.x + Ant.y*width].couleur === 1){
			Grid[Ant.x + Ant.y*width] = {}
			Grid[Ant.x + Ant.y*width].pos = Ant.x + Ant.y*width
			Grid[Ant.x + Ant.y*width].couleur = 0
			Ant.y--
			Ant.dir = 'haut'
		}
		else{
			Grid[Ant.x + Ant.y*width].pos = Ant.x + Ant.y*width
			Grid[Ant.x + Ant.y*width].couleur = 1
			Ant.y++
			Ant.dir = 'bas'
		}
	}
	else if (Ant.dir === 'droite') {
	//else{
		if(Grid[Ant.x + Ant.y*width] === undefined || Grid[Ant.x + Ant.y*width].couleur === 1){
			Grid[Ant.x + Ant.y*width] = {}
			Grid[Ant.x + Ant.y*width].pos = Ant.x + Ant.y*width
			Grid[Ant.x + Ant.y*width].couleur = 0
			Ant.y++
			Ant.dir = 'bas'
		}
		else{
			Grid[Ant.x + Ant.y*width].pos = Ant.x + Ant.y*width
			Grid[Ant.x + Ant.y*width].couleur = 1
			Ant.y--
			Ant.dir = 'haut'
		}
	}
}

const draw = () => {
  ctx.clearRect(0, 0, width, height)

	Object.keys(Grid).forEach( index => {
		let idCase = Grid[index]
		if(idCase.couleur === 0){
			ctx.fillStyle = "rgb(0, 0, 255)"
		}
		else{
			ctx.fillStyle = "rgb(255, 255, 255)"
		}
		ctx.fillRect(idCase.pos%width, Math.trunc(idCase.pos/width), 2, 2);

	});
	ctx.fillStyle = "rgb(255, 0, 0)"
	ctx.fillRect(Ant.x, Ant.y, 1, 1);
}


window.addEventListener('load', init);
window.addEventListener('resize', resize, false);
