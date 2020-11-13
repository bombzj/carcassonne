
let ctx, grid = 80, images = {}, cars, curTile, touchable = false, board=[], curMove, editMode = false, solving = false, curRotate = 0
let boardWidth = 50
let offsetX, offsetY
let touchX, touchY, tileStack, tiles
let players
let curPlayer
let curTile4Token
let lastTile	// token can place here only
let tokens

function init(c, boardW, boardH, exitX, exitY) {
	scores.initTileType()
	ctx = canvas.getContext("2d")
	let files = []
	for(let [index, item] of tileTypes.entries()) {
		files.push(index)
		item.id = index
	}
	for(let c of allColors) {
		files.push(c)
	}
	loadImages(files, () => {
		drawAll()
	});

	
	canvas.addEventListener("mousedown", function (event) {
		if(!touchable) {
			touchstart(event.offsetX, event.offsetY)
		}
	}, false);
	canvas.addEventListener("mousemove", function (event) {
		if(!touchable) {
			touchmove(event.offsetX, event.offsetY)
		}
	}, false);
	window.addEventListener("mouseup", function (event) {
		if(!touchable) {
			touchend(event.offsetX, event.offsetY)
		}
	}, false);
	
	canvas.addEventListener("touchstart", function (event) {
		touchable = true
		event.preventDefault(); 
		var bcr = event.target.getBoundingClientRect();
		touchstart(event.touches[0].clientX - bcr.x, event.touches[0].clientY - bcr.y)
	}, false);
	canvas.addEventListener("touchmove", function (event) {
		event.preventDefault(); 
		var bcr = event.target.getBoundingClientRect();
		touchmove(event.touches[0].clientX - bcr.x, event.touches[0].clientY - bcr.y)
	}, false);
	window.addEventListener("touchend", function (event) {
		var bcr = event.target.getBoundingClientRect();
		touchend(event.changedTouches[0].clientX - bcr.x, event.changedTouches[0].clientY - bcr.y)
	}, false);
}

function restart() {
	editMode = false
	scores.initScore()
	lastTile = undefined
	tileStack = []
	tokens = []
	let start, end
	let rivers = []
	let others = []
	for(let tile of tileTypes) {
		if(tile.riverStart) {
			start = tile.id
		} else if(tile.riverEnd) {
			end = tile.id
		} else {
			let connect = tile.connect
			tile.isRiver = connect[0] == river || connect[1] == river || connect[2] == river || connect[3] == river	// river must connect to river
			if(tile.isRiver) {
				for(let i = 0;i < tile.count;i++) {
					rivers.push(tile.id)
				}
			} else {
				for(let i = 0;i < tile.count;i++) {
					others.push(tile.id)
				}
			}
		}
	}
	shuffle(rivers)
	shuffle(others)
	tileStack = others//rivers.concat(end, others)
	
	tilesLeft.innerHTML = tileStack.length
	let initTile = {
		x : boardWidth / 2 + 3,
		y : boardWidth / 2,
		type : tileTypes[14], 
		rotate : 0
	}
	tiles = [ initTile ]
	scores.addTile(initTile)

	offsetX = -grid * (boardWidth / 2 - 2)
	offsetY = -grid * (boardWidth / 2 - 3)

	players = [
		{
			id : 0,
			color: allColors[0],
			token: 1,
			score: 0,
			score2: 0
		},
		{
			id : 1,
			color: allColors[1],
			token: 1,
			score: 0,
			score2: 0
		},
	]	// blue & red
	curPlayer = 0

	document.getElementById("score0").innerHTML = players[0].score
	document.getElementById("score1").innerHTML = players[1].score
	document.getElementById("scorep0").innerHTML = ""
	document.getElementById("scorep1").innerHTML = ""
	drawAll()
}

function shuffle(arr) {
	const len = arr.length
	if(len < 2) {
		return
	}
	for(let i = 0;i < len;i++) {
		let a = Math.floor(Math.random() * len)
		let b = Math.floor(Math.random() * len)
		if(a == b) {
			i--
			continue
		}
		let s = arr[a]
		arr[a] = arr[b]
		arr[b] = s
	}
}

function next() {
	if(lastTile) {
		scores.checkToken()
		document.getElementById("score0").innerHTML = players[0].score
		document.getElementById("score1").innerHTML = players[1].score
		lastTile = undefined
		curPlayer = (curPlayer + 1) % players.length
		btnNext.disabled = true
		drawAll()
	}
}

// toggle edit mode
function edit() {
	editMode = !editMode;
	if(editMode) {
		scores.checkFinalToken()
		document.getElementById("scorep0").innerHTML = "+" .concat( players[0].score2)
		document.getElementById("scorep1").innerHTML = "+" .concat( players[1].score2)
		drawAll()
	} else {
		scores.checkToken()
		document.getElementById("score0").innerHTML = players[0].score
		document.getElementById("score1").innerHTML = players[1].score
		drawAll()
	}
}
// remove all cars
function empty() {
	cars = []
	drawAll()
	if(editMode) {
		drawBackup()
	}
}

function drawAll(c) {
	ctx.clearRect(0,0,canvas.width,canvas.height); 
	for(let tile of tiles) {
		draw(tile.type.id, grid * tile.x + offsetX, grid * tile.y + offsetY, grid, grid, tile.rotate)
		if(tile.tokens) {
			let place = tile.type.place
			for(let [index, token] of tile.tokens.entries()) {
				let tokenPlace = rotate(place[index], tile.rotate)
				if(players[token]) {
					draw(players[token].color, 
						grid * (tile.x + tokenPlace[0]) + offsetX - grid/8, 
						grid * (tile.y + tokenPlace[1]) + offsetY - grid/8, 
						grid/4, grid/4)
				}
			}
		}
	}
	drawBackup()
}

function rotate(arr, r) {
	if(r == 0) {
		return arr
	} else if(r == 1) {
		return [1 - arr[1], arr[0]]
	} else if(r == 2) {
		return [1 - arr[0], 1 - arr[1]]
	} else if(r == 3) {
		return [arr[1], 1 - arr[0]]
	}
}


const zoomTile = 2;
function drawTokenPlace(tile, ex, ey) {
	let x = grid * tile.x + offsetX
	let y = grid * tile.y + offsetY
	draw(tile.type.id, x, y, grid * zoomTile, grid * zoomTile, tile.rotate)
	if(tile.type.place) {
		for(let place of tile.type.place) {
			let placeR = rotate(place, tile.rotate)
			let px = x + grid * placeR[0] * zoomTile
			let py = y + grid * placeR[1] * zoomTile
			if(Math.abs(ex - px) < grid / 4 &&
					Math.abs(ey - py) < grid / 4) {
				
			} else {
				ctx.globalAlpha = 0.5
			}
			draw(players[curPlayer].color, 
				px - grid / 4, 
				py - grid / 4,
				grid / 2, grid / 2)
			ctx.globalAlpha = 1
		}
	}
}

function placeToken(tile, ex, ey) {
	let player = players[curPlayer]
	if(!editMode && player.token == 0) {
		return
	}
	let x = grid * tile.x + offsetX
	let y = grid * tile.y + offsetY
	if(tile.type.place) {
		for(let [index, place] of tile.type.place.entries()) {
			let placeR = rotate(place, tile.rotate)
			let px = x + grid * placeR[0] * zoomTile
			let py = y + grid * placeR[1] * zoomTile
			if(Math.abs(ex - px) < grid / 4 &&
					Math.abs(ey - py) < grid / 4) {

				let group = tile.groups[index]
				if(group && group.tokens.length > 0) {
					return
				}
				
				if(!tile.tokens) {
					tile.tokens = [];
				}
				tile.tokens[index] = curPlayer
				let token = {tile : tile, index : index, player : player, type : place[2]}
				tokens.push(token)
				if(group) {
					group.tokens.push(token)
				}
				if(!editMode) {
					player.token--
					next()
				}
				return
			}
		}
	}
}

function drawBackup() {
	let startX = 8.0
	let startY = 0.1
	let w = 0.6
	if(editMode) {
		for(let [index, tileType] of tileTypes.entries()) {
			draw(index, grid * startX, grid * startY, grid*w, grid*w, curRotate)
			tileType.position = [startX, startY, w, w];	// TODO: should be one time job
			startY += 0.62
			if((index + 1) % 12 == 0) {
				startX += 0.62
				startY = 0.1
			}
		}
	} else {
		if(tileStack.length > 0) {
			if(!lastTile) {
				draw(tileStack[0], grid * startX, grid * startY, grid*0.8, grid*0.8, curRotate)
			}
			let player = players[curPlayer]

			startX = 8.0
			startY = 1.1
			for(let i = 0;i < player.token;i++) {
				draw(player.color, grid * startX, grid * startY, grid/4, grid/4)
				startX += 0.3
				if(i == 3) {
					startX = 8.0
					startY += 0.3
				}
			}
		}
	}
}

const rotateDegree = [0, Math.PI/2, Math.PI, Math.PI*3/2]
function draw(file, x, y, w = grid, h = grid, rotate = 0) {
	if(rotate > 0) {
		ctx.save()
		ctx.translate(x+w/2, y+h/2)
		ctx.rotate(rotateDegree[rotate])
		ctx.translate(-x-w/2, -y-h/2)
	}
	ctx.drawImage(images[file], x, y, w, h)
	if(rotate > 0) {
		ctx.restore()
	}
}

let dragX = null, dragY
function touchstart(ex, ey) {
	let x = ex / grid
	let y = ey / grid
	
	if(curTile4Token) {	// place token or cancel
		placeToken(curTile4Token, ex, ey)
		curTile4Token = undefined
		drawAll()
		return
	}

	if(editMode) {
		for(let [index, tileType] of tileTypes.entries()) {
			if(x >= tileType.position[0] && x < tileType.position[2] + tileType.position[0] &&
				y >= tileType.position[1] && y < tileType.position[3] + tileType.position[1]) {
				curTile = {x : -1, y : -1, type : tileTypes[index], rotate : curRotate}
				return
			}
		}
	} else if(tileStack.length > 0 && !lastTile){
		if(ex > 8 * grid && ey < grid) {
			curTile = {x : -1, y : -1, type : tileTypes[tileStack[0]], rotate : curRotate}
			return;
		}
	}
	
	let ox = x - offsetX / grid
	let oy = y - offsetY / grid
	for(let tile of tiles) {
		if(ox >= tile.x && ox < tile.x + 1 &&
			oy >= tile.y && oy < tile.y + 1) {

			if(!editMode) {
				if(!lastTile || lastTile != tile) {
					break
				}
			}
			curTile4Token = tile
			drawTokenPlace(tile)
			return
		}
	}

	if(ex < 650 && ey < 650) {
		dragX = ex - offsetX
		dragY = ey - offsetY
	}
}

function touchmove(ex, ey) {
	if(dragX != null) {
		offsetX = ex - dragX
		offsetY = ey - dragY
		drawAll()
		return
	}
	if(curTile4Token) {
		drawTokenPlace(curTile4Token, ex, ey)
	}
	let x = Math.floor((ex - offsetX) / grid)
	let y = Math.floor((ey - offsetY) / grid)
	if(true) {
		if(curTile) {
			if(x >= 0 && x <= boardWidth && y >= 0 && y <= boardWidth) {
				let board = updateBoardBase()
				let vacant = board[x][y] == undefined
				let connected = false
				let connect = curTile.type.connect
				let isRiver = curTile.type.isRiver	// river must connect to river
				if(vacant) {
					let tile = board[x-1][y];
					if(tile) {
						vacant = connect[1 + curTile.rotate & 3] == tile.type.connect[3 + tile.rotate & 3]
						if(vacant && (!isRiver || isRiver && connect[1 + curTile.rotate & 3] == river)) {
							connected = true;
						}
					}
				}
				if(vacant) {
					let tile = board[x+1][y];
					if(tile) {
						vacant = connect[3 + curTile.rotate & 3] == tile.type.connect[1 + tile.rotate & 3]
						if(vacant && (!isRiver || isRiver && connect[3 + curTile.rotate & 3] == river)) {
							connected = true;
						}
					}
				}
				if(vacant) {
					let tile = board[x][y-1];
					if(tile) {
						vacant = connect[0 + curTile.rotate & 3] == tile.type.connect[2 + tile.rotate & 3]
						if(vacant && (!isRiver || isRiver && connect[ + curTile.rotate & 3] == river)) {
							connected = true;
						}
					}
				}
				if(vacant) {
					let tile = board[x][y+1];
					if(tile) {
						vacant = connect[2 + curTile.rotate & 3] == tile.type.connect[0 + tile.rotate & 3]
						if(vacant && (!isRiver || isRiver && connect[2 + curTile.rotate & 3] == river)) {
							connected = true;
						}
					}
				}
				if(vacant && connected) {
					curTile.x = x
					curTile.y = y
				} else {
					curTile.x = -1
				}
			} else {
				curTile.x = -1
			}
			if(curTile.x == -1) {
				ctx.clearRect(0,0,canvas.width,canvas.height); 
				drawAll()
				draw(curTile.type.id, ex-grid/4, ey-grid/4, grid/2, grid/2, curRotate)
			} else {
				drawAll();
				draw(curTile.type.id, grid * curTile.x+offsetX, grid * curTile.y+offsetY, grid, grid, curRotate)
				drawBackup()
			}
		}
	}
}

function touchend(ex, ey) {
	if(tileStack.length > 0 && !lastTile && !editMode){
		if(ex > 8 * grid && ey < grid) {
			rotateBackup()
		}
	}
	if(curTile) {
		if(curTile.x != -1) {
			tiles.push(curTile)
			scores.addTile(curTile)
			if(!editMode) {
				tileStack.shift()
				tilesLeft.innerHTML = tileStack.length
				lastTile = curTile
				if(players[curPlayer].token == 0) {
					next()
				} else {
					btnNext.disabled = false
				}
			}
		}
		curTile = undefined
		drawAll()
	}
	dragX = null
}

// update board occupied
function updateBoard() {
	board = updateBoardBase()
}

function rotateBackup() {
	curRotate = (curRotate + 1) & 3
	drawAll()
}

function updateBoardBase() {
	let board = []
	for(let i = 0;i < boardWidth;i++) {
		board[i] = []
	}
	for(let tile of tiles) {
		board[tile.x][tile.y] = tile
	}
	return board;
}


function loadImages(sources, callback){
	var count = 0,
			imgNum = 0
	for(let src of sources){
			imgNum++
	}
	for(let src of sources){
			images[src] = new Image(src);
			images[src].onload = images[src].onerror = function(){
					if(++count >= imgNum){
							callback(images)
					}
			};

			images[src].src = 'res/' + src + '.png'
	}
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}