
let ctx, grid = 80, images = {}, cars, curTile, touchable = false, board=[], curMove, editMode = false, solving = false, curRotate = 0
let boardWidth = 50
let offsetX, offsetY
let touchX, touchY, tileStack, tiles
let players
let curPlayer
let curTile4Token
let lastTile	// token can place here only

function init(c, boardW, boardH, exitX, exitY) {
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
		touchend(event.touches[0].clientX - bcr.x, event.touches[0].clientY - bcr.y)
	}, false);
}

function restart() {
	editMode = false
	lastTile = undefined
	tileStack = []
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
	tileStack = rivers.concat(end, others)
	
	tilesLeft.innerHTML = tileStack.length

	tiles = [
		[boardWidth / 2 + 3, boardWidth / 2, 14, 0],
		// [boardWidth / 2 + 2, boardWidth / 2, 0, 0, [0, 0, 0]],
	]
	offsetX = -grid * (boardWidth / 2 - 2)
	offsetY = -grid * (boardWidth / 2 - 3)

	players = [
		{
			color: allColors[0],
			token: 7,
		},
		{
			color: allColors[1],
			token: 7,
		},
	]	// blue & red
	curPlayer = 0

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
		drawAll()
	} else {
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
		draw(tile[2], grid * tile[0] + offsetX, grid * tile[1] + offsetY, grid, grid, tile[3])
		if(tile[4]) {
			let place = tileTypes[tile[2]].place
			for(let [index, token] of tile[4].entries()) {
				let tokenPlace = rotate(place[index], tile[3])
				if(players[token]) {
					draw(players[token].color, 
						grid * (tile[0] + tokenPlace[0]) + offsetX - grid/8, 
						grid * (tile[1] + tokenPlace[1]) + offsetY - grid/8, 
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
	let x = grid * tile[0] + offsetX
	let y = grid * tile[1] + offsetY
	draw(tile[2], x, y, grid * zoomTile, grid * zoomTile, tile[3])
	if(tileTypes[tile[2]].place) {
		for(let place of tileTypes[tile[2]].place) {
			let placeR = rotate(place, tile[3])
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
	let x = grid * tile[0] + offsetX
	let y = grid * tile[1] + offsetY
	if(tileTypes[tile[2]].place) {
		for(let [index, place] of tileTypes[tile[2]].place.entries()) {
			let placeR = rotate(place, tile[3])
			let px = x + grid * placeR[0] * zoomTile
			let py = y + grid * placeR[1] * zoomTile
			if(Math.abs(ex - px) < grid / 4 &&
					Math.abs(ey - py) < grid / 4) {
				if(!tile[4]) {
					tile[4] = [];
				}
				tile[4][index] = curPlayer
				
				if(!editMode) {
					player.token--
					checkToken()
					next()
				}
				return
			}
		}
	}
}

// check completion for token
function checkToken() {

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
				curTile = [-1, -1, index, curRotate]
				return
			}
		}
	} else if(tileStack.length > 0 && !lastTile){
		if(ex > 8 * grid && ey < grid) {
			curTile = [-1, -1, tileStack[0], curRotate]
			return;
		}
	}
	
	let ox = x - offsetX / grid
	let oy = y - offsetY / grid
	for(let tile of tiles) {
		if(ox >= tile[0] && ox < tile[0] + 1 &&
			oy >= tile[1] && oy < tile[1] + 1) {

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
				let board = updateBoardBase();
				let vacant = board[x][y] == undefined
				let connected = false;
				let connect = tileTypes[curTile[2]].connect
				let isRiver = tileTypes[curTile[2]].isRiver	// river must connect to river
				if(vacant) {
					let tile = board[x-1][y];
					if(tile) {
						vacant = connect[1 + curTile[3] & 3] == tileTypes[tile[2]].connect[3 + tile[3] & 3]
						if(vacant && (!isRiver || isRiver && connect[1 + curTile[3] & 3] == river)) {
							connected = true;
						}
					}
				}
				if(vacant) {
					let tile = board[x+1][y];
					if(tile) {
						vacant = connect[3 + curTile[3] & 3] == tileTypes[tile[2]].connect[1 + tile[3] & 3]
						if(vacant && (!isRiver || isRiver && connect[3 + curTile[3] & 3] == river)) {
							connected = true;
						}
					}
				}
				if(vacant) {
					let tile = board[x][y-1];
					if(tile) {
						vacant = connect[0 + curTile[3] & 3] == tileTypes[tile[2]].connect[2 + tile[3] & 3]
						if(vacant && (!isRiver || isRiver && connect[ + curTile[3] & 3] == river)) {
							connected = true;
						}
					}
				}
				if(vacant) {
					let tile = board[x][y+1];
					if(tile) {
						vacant = connect[2 + curTile[3] & 3] == tileTypes[tile[2]].connect[0 + tile[3] & 3]
						if(vacant && (!isRiver || isRiver && connect[2 + curTile[3] & 3] == river)) {
							connected = true;
						}
					}
				}
				if(vacant && connected) {
					curTile[0] = x
					curTile[1] = y
				} else {
					curTile[0] = -1
				}
			} else {
				curTile[0] = -1
			}
			if(curTile[0] == -1) {
				ctx.clearRect(0,0,canvas.width,canvas.height); 
				drawAll()
				draw(curTile[2], ex-grid/4, ey-grid/4, grid/2, grid/2, curRotate)
			} else {
				drawAll();
				draw(curTile[2], grid * curTile[0]+offsetX, grid * curTile[1]+offsetY, grid, grid, curRotate)
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
		if(curTile[0] != -1) {
			tiles.push(curTile)
			if(!editMode) {
				tileStack.shift()
				tilesLeft.innerHTML = tileStack.length
				lastTile = curTile
				btnNext.disabled = false
				checkToken()
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
		board[tile[0]][tile[1]] = tile
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